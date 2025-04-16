// src/config/websocket.js
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { addNotification } from "../redux/Notification/notification.action";

let stompClient = null;

export const connectWebSocket = (userId, token, dispatch) => {
  console.log(`Attempting to connect WebSocket for user ID: ${userId}`);

  const stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: function (str) {
      console.log("STOMP: " + str);
    },

    onConnect: function () {
      console.log("WebSocket connected successfully");

      const subscriptionPath = `/user/${userId}/queue/notifications`;
      console.log(`Subscribing to: ${subscriptionPath}`);

      stompClient.subscribe(subscriptionPath, function (message) {
        try {
          console.log("Raw message received:", message);
          const notification = JSON.parse(message.body);
          console.log("Parsed notification:", notification);
          dispatch(addNotification(notification));
        } catch (error) {
          console.error("Error processing notification:", error);
        }
      });
    },

    // Other handlers...
  });

  stompClient.activate();
  return stompClient;
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    if (stompClient.connected) {
      stompClient.deactivate();
    }
    stompClient = null;
    console.log("WebSocket disconnected");
  }
};
