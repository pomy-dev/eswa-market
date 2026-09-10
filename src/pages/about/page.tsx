import { motion } from "motion/react";
import { Award, Users, TrendingUp, Target, Zap, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";

const values = [
  { icon: Target, title: "Data-Driven", desc: "Every decision is backed by real data and measurable outcomes." },
  { icon: Zap, title: "Results-First", desc: "We are relentlessly focused on generating tangible business results." },
  { icon: Users, title: "Partnership", desc: "We treat every client like a long-term partner, not a transaction." },
  { icon: Award, title: "Excellence", desc: "We hold ourselves to the highest standards in everything we deliver." },
];

const team = [
  {
    name: "Mduduzi Ngwenya",
    role: "Founder & CEO",
    bio: "Digital marketing veteran with 12+ years growing brands across Africa and beyond.",
    initials: "MN",
  },
  {
    name: "Lerato Dube",
    role: "Head of SEO",
    bio: "Organic search specialist who has ranked hundreds of sites to page 1.",
    initials: "LD",
  },
  {
    name: "Nkosi Radebe",
    role: "Creative Director",
    bio: "Award-winning designer and brand strategist with a passion for African stories.",
    initials: "NR",
  },
  {
    name: "Amara Osei",
    role: "Paid Media Lead",
    bio: "Google and Meta certified ads expert driving millions in client revenue annually.",
    initials: "AO",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-sidebar py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-sidebar-foreground mb-6 text-balance">
              We{"'"}re the growth engine
              <br />
              your brand needs
            </h1>
            <p className="text-sidebar-foreground/60 text-lg max-w-2xl mx-auto text-balance">
              DigitalEdge was founded in Johannesburg with a simple mission: help African
              businesses compete and win in the digital age.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-5">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  DigitalEdge was born out of frustration. Our founder, Mduduzi Ngwenya, watched
                  brilliant South African businesses struggle to grow online while global
                  competitors dominated search results and social feeds.
                </p>
                <p>
                  In 2018, he assembled a team of the best digital minds in the country with one
                  goal: to give African businesses world-class digital marketing at fair prices.
                </p>
                <p>
                  Today, we{"'"}ve helped over 500 businesses grow their revenue through
                  data-driven SEO, social media, paid ads, content, and email marketing
                  — generating more than R12 million in combined client revenue.
                </p>
              </div>
              <div className="mt-6 space-y-2">
                {["500+ successful campaigns", "12M+ revenue generated for clients", "Serving 8 African countries"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-secondary rounded-2xl p-8 space-y-6">
              {[
                { label: "Founded", value: "2018" },
                { label: "Team Members", value: "24" },
                { label: "Countries", value: "8" },
                { label: "Packages Delivered", value: "2,000+" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-border pb-4 last:border-0 last:pb-0">
                  <span className="text-muted-foreground text-sm">{label}</span>
                  <span className="font-bold font-serif text-2xl">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-3xl font-bold text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="text-center p-6 border-border">
                <CardContent className="pt-0 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-3xl font-bold text-center mb-10">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="text-center p-6 border-border">
                <CardContent className="pt-0 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
                    {member.initials}
                  </div>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-sidebar text-center">
        <div className="max-w-2xl mx-auto px-4">
          <TrendingUp className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-serif text-3xl font-bold text-sidebar-foreground mb-4">
            Ready to work together?
          </h2>
          <p className="text-sidebar-foreground/60 mb-8">
            Explore our packages and start your digital growth journey today.
          </p>
          <Button size="lg" asChild className="cursor-pointer">
            <Link to="/shop">View Our Services</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
