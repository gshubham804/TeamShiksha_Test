exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello! Backend is working on Netlify",
    }),
  };
};

