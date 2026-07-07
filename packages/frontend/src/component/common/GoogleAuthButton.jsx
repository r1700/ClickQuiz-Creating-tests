import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function GoogleAuthButton({
  onSuccess,
  onError,
  text = "signin_with",
  shape = "pill",
  width = "100%",
}) {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        text={text}
        shape={shape}
        width={width}
      />
    </GoogleOAuthProvider>
  );
}
