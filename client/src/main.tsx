import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Helmet, HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <Helmet>
      <title>Lịch Sử Việt Nam</title>
      <meta name="description" content="Website thông tin lịch sử Việt Nam với các bài viết về nhân vật, sự kiện và triều đại lịch sử" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
    </Helmet>
    <App />
  </HelmetProvider>
);
