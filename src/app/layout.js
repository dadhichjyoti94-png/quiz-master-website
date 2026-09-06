import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'QuizMaster - Smart Online Quiz Platform',
  description: 'Interactive online quiz platform featuring categories, live timers, instant scoring, and comprehensive admin management.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between">
        <div>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </main>
        </div>
        <Footer />
        <ToastContainer position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
