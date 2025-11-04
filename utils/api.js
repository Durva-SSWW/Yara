// // utils/api.js
// const WEBHOOK_URL = "https://patrix9766.app.n8n.cloud/webhook/mental-health-chat";

// export const sendChatMessage = async (message) => {
//   try {
//     const response = await fetch(WEBHOOK_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message }),
//     });

//     const data = await response.json();

//     if (Array.isArray(data) && data.length > 0) {
//       return data[0].output || data[0].message || data[0].response || "I received your message!";
//     } else if (typeof data === "object") {
//       return data.output || data.message || data.response || data.myField || "I received your message!";
//     }
//     return "I received your message!";
//   } catch (error) {
//     console.error("Chat API Error:", error);
//     return "Sorry, something went wrong. Please try again.";
//   }
// };




// utils/api.js
const WEBHOOK_URL = "https://patrix9766.app.n8n.cloud/webhook/mental-health-chat";

export const sendChatMessage = async (message) => {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      return data[0].output || data[0].message || data[0].response || "I received your message!";
    } else if (typeof data === "object" && data !== null) {
      return data.output || data.message || data.response || data.myField || "I received your message!";
    }
    return "I received your message!";
  } catch (error) {
    console.error("Chat API Error:", error);
    return "Sorry, something went wrong. Please try again.";
  }
};
