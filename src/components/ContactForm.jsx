import { useState } from 'react';

const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    const res = await fetch('https://formspree.io/f/meoavbvj', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSubmitted(true);
      form.reset();
    }
  };

  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 py-12 text-slate-300">
      <h2 className="text-3xl font-bold text-white mb-4 text-center">Contact Me</h2>
      <p className="text-sm mb-6 text-center">
        Got a question or want to connect? Drop me a message and I’ll get back to you.
      </p>

      {submitted ? (
        <p className="text-center text-green-400 font-medium">
          ✅ Your message has been sent. Thank you!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            required
            placeholder="Your Name"
            className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-slate-400"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Your Email"
            className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-slate-400"
          />
          <textarea
            name="message"
            rows="5"
            required
            placeholder="Your Message"
            className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-slate-400"
          ></textarea>
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-500 text-white font-medium px-6 py-2 rounded-md transition"
          >
            Send Message
          </button>
        </form>
      )}
    </section>
  );
};

export default ContactForm;
