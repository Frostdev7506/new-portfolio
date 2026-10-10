export type ContactValues = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (values.name.trim().length < 3)
    errors.name = "Name must be at least 3 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (values.message.trim().length < 10)
    errors.message = "Message must be at least 10 characters.";
  return errors;
}

export function contactMailto(recipient: string, values: ContactValues) {
  const subject = encodeURIComponent("Website enquiry from " + values.name);
  const body = encodeURIComponent(
    values.message + "\n\nFrom: " + values.name + "\nReply to: " + values.email,
  );
  return "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
}
