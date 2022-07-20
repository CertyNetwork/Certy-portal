import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContextProvider } from '../contexts/toast-context';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { AuthProvider } from '../contexts/auth-context';
import { createTheme, ThemeProvider } from '@mui/material';

function MyApp({ Component, pageProps }: AppProps) {
  const client = new ApolloClient({
    uri: process.env.SUB_GRAPH,
    cache: new InMemoryCache(),
  });

  const theme = createTheme({
    //here you set palette, typography ect...
  })

  return (
    <ThemeProvider theme={theme}>
      <ToastContextProvider>
        <ApolloProvider client={client}>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </ApolloProvider>
      </ToastContextProvider>
    </ThemeProvider>
  );
}

export default MyApp
