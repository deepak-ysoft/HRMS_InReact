import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRouter from "./routes/AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
