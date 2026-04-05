import SubmitForm from './SubmitForm';

export const metadata = {
  title: 'Submit a Coffee Shop — Brew Guide',
  description: 'Add your independent coffee shop to Brew Guide. Get discovered by remote workers, students, and travelers.',
};

export default function SubmitPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-espresso-800 mb-2">Submit Your Coffee Shop</h1>
        <p className="text-espresso-600">
          Get listed in front of remote workers, students, and travelers searching in your city.
          Submissions are reviewed within a few business days.
        </p>
      </div>
      <SubmitForm />
    </div>
  );
}
