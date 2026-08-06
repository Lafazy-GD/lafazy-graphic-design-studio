import { motion } from 'framer-motion';
import { Shield, CreditCard, RefreshCw, FileText } from 'lucide-react';
import { useSeo } from '@/lib/seo';
import { Section, Breadcrumbs } from '@/components/ui';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    icon: CreditCard,
    title: 'Payment Methods',
    content: [
      'We accept the following payment methods:',
      'Nigerian Naira (NGN): Bank Transfer, Opay, Moniepoint, PalmPay',
      'US Dollar (USD): Raenest USD Account, Bank Transfer (SWIFT)',
      'Cryptocurrency: Binance Pay, USDT (TRC20), USDT (BEP20), Bitcoin (BTC), Ethereum (ETH)',
      'All payment details are provided on our Payment page after you select your preferred method.',
    ],
  },
  {
    icon: Shield,
    title: 'Payment Schedule',
    content: [
      'Project-Based Work: 50% deposit is required to begin work. The remaining 50% is due upon project completion and before final files are delivered.',
      'Monthly Retainers: Payment is due in advance at the beginning of each month.',
      'Enterprise Contracts: Payment terms are defined in the individual service agreement.',
      'All invoices are due within 7 days of issuance unless otherwise agreed.',
    ],
  },
  {
    icon: FileText,
    title: 'Invoice & Receipts',
    content: [
      'Every project receives a professional invoice with a unique invoice number.',
      'After making payment, clients must submit a payment confirmation through our Payment Center with their receipt.',
      'Payment verification is completed within 24 hours of submission.',
      'A formal receipt is issued after payment verification is complete.',
    ],
  },
];

export function PaymentPolicyPage() {
  useSeo({
    title: 'Payment Policy | Lafazy Studio',
    description: 'Payment methods, schedules, and policies for Lafazy Graphic Design Studio. NGN, USD, and cryptocurrency accepted.',
    canonicalPath: '/payment-policy',
  });

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-12">
        <div className="container-max section-padding">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Payment Policy' }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3">Legal</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-balance">Payment Policy</h1>
            <p className="mt-4 text-gray-400">Last updated: August 2026</p>
          </motion.div>
        </div>
      </section>

      <Section className="!pt-4">
        <div className="container-max section-padding max-w-3xl space-y-8">
          {SECTIONS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">{s.title}</h2>
              </div>
              <div className="space-y-3">
                {s.content.map((p, j) => (
                  <p key={j} className="text-sm text-gray-400 leading-relaxed">{p}</p>
                ))}
              </div>
            </motion.div>
          ))}
          <div className="glass-card p-6 text-center">
            <p className="text-sm text-gray-400">
              Questions about payments? <Link to="/contact" className="text-brand-400 hover:text-brand-300">Contact us</Link> or visit our <Link to="/payment" className="text-brand-400 hover:text-brand-300">Payment Center</Link>.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

const REFUND_SECTIONS = [
  {
    title: 'Deposit Policy',
    content: [
      'The 50% initial deposit is non-refundable once work has commenced. This covers the time and resources allocated to your project including research, concept development, and initial design work.',
      'If you cancel before work begins (within 48 hours of payment), the deposit is fully refundable.',
    ],
  },
  {
    title: 'Work in Progress',
    content: [
      'If a project is cancelled mid-way through completion, the client is billed for all work completed up to the point of cancellation, and any remaining balance from the deposit is refunded.',
      'All work completed up to the cancellation point will be delivered to the client.',
    ],
  },
  {
    title: 'Completed Work',
    content: [
      'Once final files have been delivered and the final payment is made, the project is considered complete and no refunds are available.',
      'However, we offer a 7-day revision window after delivery for minor adjustments within the original scope.',
    ],
  },
  {
    title: 'Dissatisfaction with Work',
    content: [
      'If you are dissatisfied with the work, we will work with you to make it right through revision rounds as defined in your package.',
      'If after all revision rounds you are still unsatisfied, we will discuss options including partial refund or additional work at no cost.',
      'Our goal is 100% client satisfaction and we will always work to resolve any issues.',
    ],
  },
];

export function RefundPolicyPage() {
  useSeo({
    title: 'Refund Policy | Lafazy Studio',
    description: 'Refund and cancellation policy for Lafazy Graphic Design Studio.',
    canonicalPath: '/refund-policy',
  });

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-12">
        <div className="container-max section-padding">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Refund Policy' }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3">Legal</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-balance">Refund Policy</h1>
            <p className="mt-4 text-gray-400">Last updated: August 2026</p>
          </motion.div>
        </div>
      </section>

      <Section className="!pt-4">
        <div className="container-max section-padding max-w-3xl space-y-8">
          {REFUND_SECTIONS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-brand-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">{s.title}</h2>
              </div>
              <div className="space-y-3">
                {s.content.map((p, j) => (
                  <p key={j} className="text-sm text-gray-400 leading-relaxed">{p}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}

const TOS_SECTIONS = [
  {
    title: '1. Services',
    content: [
      'Lafazy Graphic Design Studio ("the Studio", "we", "us") provides graphic design, branding, visual identity, AI prompt engineering, and creative direction services to clients worldwide.',
      'All services are delivered remotely unless otherwise agreed in writing.',
      'The scope of each project is defined in the invoice or proposal agreed upon before work begins.',
    ],
  },
  {
    title: '2. Client Responsibilities',
    content: [
      'The client agrees to provide timely feedback, content, and materials required for the project.',
      'The client is responsible for ensuring they have the right to use any materials (images, text, logos) provided to the Studio for inclusion in the project.',
      'Delays caused by the client may extend the project timeline and may incur additional fees.',
    ],
  },
  {
    title: '3. Intellectual Property',
    content: [
      'Upon full payment, the client receives ownership of the final delivered design files.',
      'The Studio retains the right to display the work in its portfolio and marketing materials unless a non-disclosure agreement is signed.',
      'Third-party assets (fonts, stock images, plugins) are licensed under their respective terms and are the client\'s responsibility to maintain.',
    ],
  },
  {
    title: '4. Revisions',
    content: [
      'Each package includes a defined number of revision rounds. Additional revisions beyond the included amount are billed at an hourly rate.',
      'Revisions are defined as changes to existing concepts, not entirely new directions.',
    ],
  },
  {
    title: '5. Confidentiality',
    content: [
      'The Studio treats all client information as confidential and will not share it with third parties without consent.',
      'Payment information is stored securely and is never shared with third parties.',
    ],
  },
  {
    title: '6. Limitation of Liability',
    content: [
      'The Studio\'s liability is limited to the total amount paid for the project.',
      'The Studio is not liable for indirect, incidental, or consequential damages.',
    ],
  },
  {
    title: '7. Governing Law',
    content: [
      'These terms are governed by the laws of Nigeria. Any disputes will be resolved through good-faith negotiation first, and if unresolved, through arbitration.',
    ],
  },
];

export function TermsPage() {
  useSeo({
    title: 'Terms of Service | Lafazy Studio',
    description: 'Terms of service for Lafazy Graphic Design Studio.',
    canonicalPath: '/terms',
  });

  return (
    <>
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-12">
        <div className="container-max section-padding">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Terms of Service' }]} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-400 mb-3">Legal</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white text-balance">Terms of Service</h1>
            <p className="mt-4 text-gray-400">Last updated: August 2026</p>
          </motion.div>
        </div>
      </section>

      <Section className="!pt-4">
        <div className="container-max section-padding max-w-3xl space-y-6">
          {TOS_SECTIONS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 sm:p-8"
            >
              <h2 className="text-lg font-semibold text-white mb-3">{s.title}</h2>
              <div className="space-y-3">
                {s.content.map((p, j) => (
                  <p key={j} className="text-sm text-gray-400 leading-relaxed">{p}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}
