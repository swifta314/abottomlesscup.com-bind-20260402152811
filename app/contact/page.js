import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact — Brew Guide',
  description: 'Get in touch with the Brew Guide team.',
};

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl text-espresso-800 mb-2">Contact Us</h1>
      <p className="text-espresso-600 mb-8 text-sm">Have a question, feedback, or partnership inquiry? We'd love to hear from you.</p>
      <ContactForm />
    </div>
  );
}
