

// import auth0 from  '@auth0/nextjs-auth0'

// export default async function callback(req, res) {
//   try {
//     await auth0.handleCallback(req, res, {
//       onUserLoaded: async (req, res, session, state) => {
//         // Capture the user details from session.user
//         const user = session.user;
        
//         // Call your backend API to save the user details
//         await fetch('http://localhost:3030/users', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(user),
//         });
//       },
//     });
//   } catch (error) {
//     res.status(error.status || 500).end(error.message);
//   }
// }




import { NextApiRequest, NextApiResponse } from 'next';
import auth0 from '@auth0/nextjs-auth0';
import { getSession } from '@auth0/nextjs-auth0';

interface CustomError extends Error {
  status?: number;
}

export default async function callback(req: NextApiRequest, res: NextApiResponse) {
  try {
    await auth0.handleCallback(req, res);

    const session = await getSession(req, res); // Fetch the session after handling the callback

    if (session) {
      const user = session.user;

      // Call your backend API to save the user details
      await fetch('http://localhost:3030/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
    }
  } catch (error) {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (error instanceof Error) {
      const customError = error as CustomError;
      statusCode = customError.status || 500;
      message = customError.message || 'Internal Server Error';
    }
    res.status(statusCode).end(message);
  }
}
