import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  CreditCard,
  Database,
  Users,
  Shield,
  Mail,
  Zap,
  CheckCircle2,
  Clock,
  Code,
  Server,
  GitBranch,
  Settings,
  Rocket,
  TrendingUp,
  Globe,
  FileText,
} from 'lucide-react';
import { Terminal } from './terminal';

export default function HomePage() {
  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
               Build & Launch
                <span className="block text-orange-500">SaaS in Days</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                The SaaS builder for teams that want to ship fast.
                PandaSaaS ships auth, billing, teams, and ops so you can stay in
                product mode, not plumbing mode.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <a
                  href="https://vercel.com/templates/next.js/next-js-saas-starter"
                  target="_blank"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg rounded-full"
                  >
                    Launch with PandaSaaS
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <Terminal />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything a SaaS Builder Needs
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              PandaSaaS comes pre-wired with product, revenue, and ops building blocks.
            </p>
          </div>
          <div className="mt-12 lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path
                    fill="currentColor"
                    d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"
                  />
                </svg>
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Next.js + React
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Ship at React speed with a production-grade Next.js foundation.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <Database className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Postgres + Drizzle ORM
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Opinionated schema patterns for multi-tenant SaaS that scale.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Stripe Subscriptions
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Ready-made pricing, checkout, and invoicing flows for SaaS revenue.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <Shield className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Authentication & Security
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Hardened session flows, secure cookies, and role-aware guards by default.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Team Workspaces
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Multi-tenant workspaces, roles, and invites baked in for collaboration.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <Mail className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Email Notifications
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  SendGrid-powered lifecycle emails: invites, trials, renewals, and alerts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Build with PandaSaaS?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Trade boilerplate for velocity and focus on customer value.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mx-auto">
                <Zap className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Fast Setup
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Create a workspace, wire Stripe, and ship your first feature the same day.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mx-auto">
                <Code className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Production Ready
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Prebuilt flows for auth, billing, and compliance-friendly session handling.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mx-auto">
                <Server className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Scalable Architecture
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Multi-tenant patterns, background jobs, and observability hooks included.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mx-auto">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Time Saver
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Spend time on differentiators, not recreating the same SaaS plumbing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Builder-First Features
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              PandaSaaS ships the core moves every SaaS needs on day one.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'User authentication & secure sessions',
              'Team workspaces with roles',
              'Role-based access control',
              'Stripe subscription billing',
              'Email notifications (SendGrid)',
              'Activity logging for audits',
              'Team member invitations',
              'Trial and renewal alerts',
              'Customer portal integration',
              'Webhook handling templates',
              'Database migrations ready',
              'Type-safe API routes',
            ].map((feature, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="ml-3 text-base text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Launch with PandaSaaS in 4 Steps
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Opinionated defaults get you from clone to cash fast.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-500 mb-4">
                <GitBranch className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Clone & Install
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Clone PandaSaaS and install dependencies with one command.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-500 mb-4">
                <Settings className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Configure
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Drop in env vars for database, Stripe, and email in minutes.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-500 mb-4">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Setup Database
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Run migrations and seed multi-tenant defaults instantly.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-500 mb-4">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Launch
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Start building features and deploy to production when you&apos;re ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              The PandaSaaS Stack
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Modern, secure, and proven tech chosen for SaaS speed.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { name: 'Next.js', desc: 'React Framework' },
              { name: 'TypeScript', desc: 'Type Safety' },
              { name: 'PostgreSQL', desc: 'Database' },
              { name: 'Drizzle ORM', desc: 'Type-safe ORM' },
              { name: 'Stripe', desc: 'Payments' },
              { name: 'SendGrid', desc: 'Email Service' },
            ].map((tech, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 text-center hover:bg-orange-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900">{tech.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Built for SaaS Builders
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Whether you&apos;re validating or scaling, PandaSaaS accelerates the path.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                B2B SaaS Products
              </h3>
              <p className="text-gray-500">
                Launch subscription products with workspaces, roles, and billing ready.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Startup MVPs
              </h3>
              <p className="text-gray-500">
                Validate quickly with production-grade flows so you can focus on product fit.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Enterprise Solutions
              </h3>
              <p className="text-gray-500">
                Serve larger customers with tenant isolation, audit trails, and secure sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-3 items-start">
          <div>
            <h3 className="text-xl font-semibold">PandaSaaS</h3>
            <p className="mt-3 text-gray-300">
              The opinionated SaaS builder that ships auth, billing, teams, and ops out of the box.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Build Faster</h4>
            <ul className="mt-3 space-y-2 text-gray-300">
              <li>Next.js + TypeScript core</li>
              <li>Stripe subscriptions ready</li>
              <li>Multi-tenant workspaces</li>
              <li>Secure sessions & RBAC</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Stay in the Loop</h4>
            <p className="mt-3 text-gray-300">
              Get PandaSaaS updates, new templates, and launch guides.
            </p>
            <a
              className="inline-flex items-center mt-4 px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              href="https://vercel.com/templates/next.js/next-js-saas-starter"
              target="_blank"
            >
              Join the waitlist
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
            <span>© {new Date().getFullYear()} PandaSaaS. All rights reserved.</span>
            <div className="flex space-x-4 mt-2 sm:mt-0">
              <a className="hover:text-white" href="/privacy">
                Privacy
              </a>
              <a className="hover:text-white" href="/terms">
                Terms
              </a>
              <a className="hover:text-white" href="mailto:founders@pandasaas.com">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
