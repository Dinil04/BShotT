from flask import Flask, request, jsonify, Response
from tensorflow.keras.models import load_model
import pickle
import pandas as pd
import numpy as np
import cv2
import mediapipe as mp
import os
import uuid
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

model = load_model("lstm_shot_classifier.h5")
with open("label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

angle_features = ['elbow', 'shoulder', 'knee', 'body', 'face']
sequence_length = 60
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

SHOT_RULES = {
    "Defence": {"elbow": 119.50, "shoulder": 28.02, "knee": 120.82, "body": 95.43, "face": 84.11},
    "Cut_shot": {"elbow": 90.33, "shoulder": 69.92, "knee": 92.65, "body": 90.49, "face": 54.96},
    "Cover_Drive": {"elbow": 104.09, "shoulder": 84.16, "knee": 109.11, "body": 105.38, "face": 63.98},
    "Pull_Shot": {"elbow": 85.16, "shoulder": 66.60, "knee": 127.58, "body": 129.05, "face": 53.78},
    "Sweep_Shot": {"elbow": 117.42, "shoulder": 50.02, "knee": 104.57, "body": 99.62, "face": 68.40}
}

# Global variable to store the latest captured angles
latest_angles = {}

def calculate_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    return 360 - angle if angle > 180 else angle

def get_lm(lm, name):
    return [lm[mp_pose.PoseLandmark[name].value].x, lm[mp_pose.PoseLandmark[name].value].y]

@app.route('/video_feed', methods=['GET'])
def video_feed():
    selected_shot_type = request.args.get('shot_type', 'Defence')  # Get selected shot type from query parameter

    def generate():
        cap = cv2.VideoCapture(0)
        start_time = time.time()  # Start time for auto-stop
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(frame_rgb)
            if results.pose_landmarks:
                lm = results.pose_landmarks.landmark
                try:
                    # Get landmarks for key joints
                    rs = get_lm(lm, "RIGHT_SHOULDER")
                    re = get_lm(lm, "RIGHT_ELBOW")
                    rw = get_lm(lm, "RIGHT_WRIST")
                    rh = get_lm(lm, "RIGHT_HIP")
                    rk = get_lm(lm, "RIGHT_KNEE")
                    ra = get_lm(lm, "RIGHT_ANKLE")
                    le = get_lm(lm, "LEFT_EYE")
                    no = get_lm(lm, "NOSE")
                    reye = get_lm(lm, "RIGHT_EYE")

                    # Calculate angles
                    current_angles = {
                        "elbow": calculate_angle(rs, re, rw),
                        "shoulder": calculate_angle(rh, rs, re),
                        "knee": calculate_angle(rh, rk, ra),
                        "body": calculate_angle(rs, rh, rk),
                        "face": calculate_angle(le, no, reye)
                    }

                    # Save the current angles to global variable for later feedback
                    latest_angles['angles'] = current_angles
                    latest_angles['timestamp'] = time.time()

                    # Compare angles with selected shot's predefined rules
                    shot_rules = SHOT_RULES[selected_shot_type]
                    feedback = "Correct Shot" if all(abs(current_angles[joint] - shot_rules[joint]) < 10 for joint in shot_rules) else "Incorrect Shot"
                    
                    # Display angles and feedback on the video feed
                    y_offset = 40
                    for joint, angle in current_angles.items():
                        correct_angle = shot_rules[joint]
                        color = (0, 255, 0) if abs(angle - correct_angle) < 10 else (0, 0, 255)
                        cv2.putText(frame, f"{joint.capitalize()}: {angle:.2f}", (10, y_offset),
                                    cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
                        y_offset += 40  # Increase the offset for each joint

                    # Display shot feedback
                    cv2.putText(frame, f"Shot: {selected_shot_type}", (10, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    cv2.putText(frame, feedback, (10, y_offset + 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

                except Exception as e:
                    print(f"Error: {e}")
                    pass

                # Draw pose landmarks
                mp.solutions.drawing_utils.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

            # Auto-stop after 10 seconds
            if time.time() - start_time > 10:
                break

            # Convert the frame to JPEG for streaming
            _, jpeg = cv2.imencode('.jpg', frame)
            frame_bytes = jpeg.tobytes()
            yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        cap.release()

    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded!"})
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file!"})
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    angles_csv = extract_angles_from_video(file_path)
    predicted_shot, confidence = predict_shot_from_csv(angles_csv)
    feedback = get_feedback(predicted_shot, confidence)
    os.remove(angles_csv)
    return jsonify({
        "prediction": predicted_shot,
        "accuracy": round(confidence * 100, 2),
        "message": "Shot classification successful!",
        "feedback": feedback["message"],
        "mark": feedback["mark"]
    })

def extract_angles_from_video(video_path):
    cap = cv2.VideoCapture(video_path)
    angles = []
    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.resize(frame, (640, 360))
        results = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        frame_count += 1
        if results.pose_landmarks:
            lm = results.pose_landmarks.landmark
            try:
                rs = get_lm(lm, "RIGHT_SHOULDER")
                re = get_lm(lm, "RIGHT_ELBOW")
                rw = get_lm(lm, "RIGHT_WRIST")
                rh = get_lm(lm, "RIGHT_HIP")
                rk = get_lm(lm, "RIGHT_KNEE")
                ra = get_lm(lm, "RIGHT_ANKLE")
                le = get_lm(lm, "LEFT_EYE")
                no = get_lm(lm, "NOSE")
                reye = get_lm(lm, "RIGHT_EYE")
                angles.append({
                    "frame": frame_count,
                    "elbow": calculate_angle(rs, re, rw),
                    "shoulder": calculate_angle(rh, rs, re),
                    "knee": calculate_angle(rh, rk, ra),
                    "body": calculate_angle(rs, rh, rk),
                    "face": calculate_angle(le, no, reye)
                })
            except:
                continue
    cap.release()
    df = pd.DataFrame(angles)
    temp_csv_path = f"temp_{uuid.uuid4().hex}.csv"
    df.to_csv(temp_csv_path, index=False)
    return temp_csv_path

def predict_shot_from_csv(csv_path):
    df = pd.read_csv(csv_path)
    angles_seq = df[angle_features].values
    if angles_seq.shape[0] > sequence_length:
        angles_seq = angles_seq[:sequence_length]
    elif angles_seq.shape[0] < sequence_length:
        pad = np.zeros((sequence_length - angles_seq.shape[0], len(angle_features)))
        angles_seq = np.vstack([angles_seq, pad])
    angles_seq = np.expand_dims(angles_seq, axis=0)
    prediction = model.predict(angles_seq)
    predicted_label = label_encoder.inverse_transform([np.argmax(prediction)])[0]
    confidence = float(np.max(prediction))
    return predicted_label, confidence

def get_feedback(prediction, confidence):
    feedback = {
        "Cover Drive": {"message": "Great timing! Try to focus on the ball's bounce and position to enhance control.", "mark": 90 if confidence >= 0.9 else 75},
        "Pull Shot": {"message": "Nice reaction! Consider lowering your backlift for better shot execution.", "mark": 80 if confidence >= 0.85 else 70},
        "Defence": {"message": "Solid defense! Try adjusting your footwork for better stability.", "mark": 85 if confidence >= 0.8 else 70},
        "Cut Shot": {"message": "Well done! Focus on a more balanced stance for better shot control.", "mark": 90 if confidence >= 0.9 else 75},
        "Square Drive": {"message": "Good shot! Work on your wrist position for more precision.", "mark": 85 if confidence >= 0.85 else 75},
        "Backfoot Punch": {"message": "Excellent backfoot punch! Consider keeping a firmer grip on the bat.", "mark": 95 if confidence >= 0.9 else 80}
    }
    return feedback.get(prediction, {"message": "Keep practicing! Consistency is key.", "mark": 50})

# New route to provide angle feedback after the live feed has stopped
@app.route('/angle_feedback', methods=['POST'])
def angle_feedback():
    data = request.get_json()
    shot_type = data.get("shot_type")
    captured = latest_angles.get('angles', {})
    if not captured or not shot_type:
        return jsonify({"error": "No shot or angle data found."}), 400

    feedback = {}
    shot_rules = SHOT_RULES.get(shot_type)
    if not shot_rules:
        return jsonify({"error": "Invalid shot type."}), 400

    for joint, ideal_angle in shot_rules.items():
        player_angle = captured.get(joint)
        if player_angle is None:
            feedback[joint] = "❌ Not detected"
        elif abs(player_angle - ideal_angle) < 10:
            feedback[joint] = f"✅ {joint.capitalize()} angle is correct"
        else:
            feedback[joint] = f"❌ {joint.capitalize()} angle needs improvement"

    return jsonify({
        "shot_type": shot_type,
        "feedback": feedback,
        "player_angles": captured
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
