export async function fetchQuestions() {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      id: 1,
      fileUrl: '/images/features/ha_math_question.png',
      fileType: 'image',
      fileName: 'Math Homework Page 1',
      questions: [
        {
          id: 101,
          text: 'Prove the trace of matrix is product of diagonal entries',
          checked: true,
        },
        {
          id: 102,
          text: 'Answer the following:',
          subItems: [
            '(a) Find A+B',
            '(b) Find A−B',
            '(c) Find the product ABAB',
            '(d) Find the transpose of matrix A, denoted as A^T',
            '(e) Determine if matrix A is a symmetric matrix. Justify your answer.',
          ],
          checked: false,
        },
        {
          id: 103,
          text: 'Prove that tr(aA+bB) = atr(A) + btr(B)',
          checked: false,
        },
      ],
    },
    {
      id: 2,
      fileUrl: '/pdfs/sample_math.pdf',
      fileType: 'pdf',
      fileName: 'Math Assignment 2',
      questions: [
        {
          id: 201,
          text: 'Calculate the determinant of the following matrix',
          checked: false,
        },
        {
          id: 202,
          text: 'Find the eigenvalues and eigenvectors',
          checked: false,
        },
      ],
    },
    {
      id: 3,
      fileUrl: '/images/features/ha_math_question_2.png',
      fileType: 'image',
      fileName: 'Math Homework Page 3',
      questions: [
        {
          id: 301,
          text: 'Solve the system of linear equations',
          checked: false,
        },
        {
          id: 302,
          text: 'Find the inverse of matrix M',
          checked: false,
        },
        {
          id: 303,
          text: 'Calculate the rank of the following matrix',
          checked: false,
        },
      ],
    },
  ];
}

export async function submitSelectedQuestions(questionIds) {
  console.log('Submitting questions:', questionIds);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    redirectUrl: '/answers',
    submissionId: 'sub_' + Math.random().toString(36).substring(2, 15),
  };
}
