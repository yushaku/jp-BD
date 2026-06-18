import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contactInfo } from "@/lib/contact";

export function ContactInfoGrid() {
  const { address, contact, hours } = contactInfo;

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-12 md:grid-cols-3">
      <Card className="border-0 bg-jp-cream ring-0 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="size-5 text-jp-gold" />
            {address.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          {address.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 bg-jp-cream ring-0 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="size-5 text-jp-vermillion" />
            {contact.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Hotline:{" "}
            <a
              href={contact.hotlineHref}
              className="font-semibold text-jp-indigo hover:underline"
            >
              {contact.hotline}
            </a>
          </p>
          <p className="flex items-center gap-1.5">
            <Mail className="size-4 shrink-0" />
            <a
              href={contact.emailHref}
              className="text-jp-indigo hover:underline"
            >
              {contact.email}
            </a>
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 bg-jp-cream ring-0 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="size-5 text-jp-gold" />
            {hours.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="text-jp-indigo font-bold">
              {hours.weekdays.label}
            </span>
            <span className="font-medium text-foreground">
              : {hours.weekdays.time}
            </span>
          </p>
          <p>
            <span className="text-jp-indigo font-bold">
              {hours.weekend.label}
            </span>
            <span className="font-medium text-foreground">
              : {hours.weekend.time}
            </span>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
