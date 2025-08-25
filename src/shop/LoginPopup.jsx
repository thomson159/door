import React from "react";
import { Input, Button, Popup, Spinner, ErrorMsg } from "./styled";

const LoginPopup = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  loading,
  error,
  validationError,
}) => {
  return (
    <Popup style={{ maxWidth: 500 }}>
      <h2>Logowanie</h2>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleLogin} disabled={loading}>
        {loading ? "Logowanie..." : "Zaloguj"}
      </Button>
      {loading && <Spinner />}
      {validationError && <ErrorMsg>{validationError}</ErrorMsg>}
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </Popup>
  );
};

export default LoginPopup;
