n(generate_exercise(topics, subject))
    # for i in range(len(topics)):
    #     cursor.execute('''
    #         INSERT INTO question (id, type, options, points, topic, answer, solution, exam_id)
    #         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    #         ''', (i, questions[i]["type"], questions[i]["options"], questions[i]["points"], questions[i]["topic"], str(questions[i]["answer"]),str(questions[i]["solution"])),count)
    #     print("QUESTION dodany")