import Image from "next/image";

export function PageIntro({
  eyebrow,
  title,
  description,
  image,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
}) {
  return (
    <header className={"page-intro " + className + (image ? " has-art" : "")}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {image && (
        <Image
          src={image}
          alt=""
          width={480}
          height={320}
          className="intro-art"
          priority
        />
      )}
    </header>
  );
}
