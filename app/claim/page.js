import ClaimForm from './ClaimForm';

export const metadata = {
  title: 'Claim Your Listing — Brew Guide',
  description: 'Claim and manage your coffee shop listing on Brew Guide.',
};

export default function ClaimPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl text-espresso-800 mb-2">Claim Your Listing</h1>
      <p className="text-espresso-600 mb-8 text-sm">
        Are you the owner of a coffee shop listed on Brew Guide? Claim your listing to manage your details,
        respond to visitors, and access featured placement options.
      </p>
      <ClaimForm />
    </div>
  );
}
