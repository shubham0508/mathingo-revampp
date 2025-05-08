export async function fetchQuestions() {
  try {
    return {
      status_code: 201,
      data: {
        files: [
          {
            file_id: '2d494be1-2caf-4d73-b358-efd385431adf',
            file_type: 'image',
            pages: [
              {
                question_id: 'e2cddd23-9778-4418-b9b7-5ae85ccab0e3',
                page_no: 1,
                image_id: 'image_1',
                questions: [
                  'What is the probability of rolling a sum of 7 with two dice?',
                  'If a coin is tossed 3 times, what is the probability of getting exactly 2 heads?',
                  'A bag contains 3 red balls and 5 blue balls. What is the probability of picking a red ball?',
                  'What is the probability of drawing an Ace from a standard deck of 52 playing cards?',
                  'Two cards are drawn at random from a deck of 52 cards. What is the probability that both are spades?',
                ],
              },
            ],
            file_url: '/images/probability-questions.jpg',
          },
          {
            file_id: '3e594cf2-3dbb-5e84-c469-ffd496542beg',
            file_type: 'pdf',
            pages: [
              {
                question_id: 'f3deeed3-8889-5529-c8c8-6bf96dcaabf4',
                page_no: 1,
                image_id: 'pdf_1',
                questions: [
                  'Solve the quadratic equation: x² + 5x + 6 = 0',
                  'Find the derivative of f(x) = 3x² + 2x - 1',
                  'Calculate the integral of g(x) = 2x + 3',
                ],
              },
            ],
            file_url: '/pdfs/math-questions.pdf',
          },
        ],
      },
      error: [],
    };
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

export async function submitSelectedQuestions(questionIds) {
  try {
    // In a real implementation, this would be an actual API call
    // const response = await fetch('/api/submit-questions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ questionIds })
    // });
    // const data = await response.json();

    // Mock successful response
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    return {
      success: true,
      redirectUrl: '/answers',
      submissionId: 'sub_' + Math.random().toString(36).substring(2, 15),
    };
  } catch (error) {
    console.error('Error submitting questions:', error);
    throw error;
  }
}
