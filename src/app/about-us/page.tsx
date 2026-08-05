import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
};

export default function AboutUsPage() {
  return (
    <section>
      <h1>About Us</h1>
      <p>Route placeholder. This page is specified in docs/features/06-about-us.md (FE-06).</p>
    </section>
  );
}
