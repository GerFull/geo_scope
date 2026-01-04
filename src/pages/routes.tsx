import { Routes, Route } from "react-router-dom";

import Login from "./login/login";

// eslint-disable-next-line react-refresh/only-export-components
export default () => (
  <Routes>
    <Route path="/login" element={<Login />} />
  </Routes>
);
