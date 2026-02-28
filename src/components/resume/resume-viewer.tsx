import React from "react";
import { Github, Linkedin, Globe, Mail, Smartphone } from "lucide-react";
import resumeData from "@/data/resume.json";

export function ResumeViewer() {
    return (
        <div className="flex justify-center bg-gray-100 min-h-screen p-4 md:p-8 font-sans">
            <div
                className="bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm] p-[12.7mm] text-[11px] leading-[1.3] text-black"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
                {/* Title */}
                <div className="text-center mb-3">
                    <h1 className="text-3xl font-bold mb-1">{resumeData.personal.name}</h1>
                    <div className="flex flex-wrap justify-center gap-2 items-center text-[10px]">
                        <a href={resumeData.personal.github} className="flex items-center gap-1 text-[#003399] hover:underline">
                            <Github className="w-3 h-3" /> GitHub
                        </a>
                        <span className="text-gray-400">|</span>
                        <a href={resumeData.personal.linkedIn} className="flex items-center gap-1 text-[#003399] hover:underline">
                            <Linkedin className="w-3 h-3" /> LinkedIn
                        </a>
                        <span className="text-gray-400">|</span>
                        <a href={resumeData.personal.portfolio} className="flex items-center gap-1 text-[#003399] hover:underline">
                            <Globe className="w-3 h-3" /> Portfolio
                        </a>
                        <span className="text-gray-400">|</span>
                        <a href={`mailto:${resumeData.personal.email}`} className="flex items-center gap-1 text-[#003399] hover:underline">
                            <Mail className="w-3 h-3" /> {resumeData.personal.email}
                        </a>
                        <span className="text-gray-400">|</span>
                        <a href={`tel:${resumeData.personal.mobile}`} className="flex items-center gap-1 text-[#003399] hover:underline">
                            <Smartphone className="w-3 h-3" /> {resumeData.personal.mobile}
                        </a>
                    </div>
                </div>

                {/* Summary */}
                <Section title="Professional Summary">
                    <p dangerouslySetInnerHTML={{ __html: resumeData.summary }} />
                </Section>

                {/* Experience */}
                <Section title="Work Experience">
                    <div className="flex flex-col gap-2">
                        {resumeData.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <span dangerouslySetInnerHTML={{ __html: exp.title }} />
                                    <span className="text-[10px] whitespace-nowrap">{exp.date}</span>
                                </div>
                                <ul className="list-disc pl-4 marker:text-black space-y-[1px]">
                                    {exp.points.map((point, j) => (
                                        <li key={j} dangerouslySetInnerHTML={{ __html: point }} />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Projects */}
                <Section title="Projects">
                    <div className="flex flex-col gap-[8px]">
                        {resumeData.projects.map((proj, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-[2px]">
                                    <span dangerouslySetInnerHTML={{ __html: proj.title }} />
                                    <span className="text-[10px] whitespace-nowrap space-x-1">
                                        {proj.links.map((link, j) => (
                                            <React.Fragment key={j}>
                                                <a href={link.url} className="text-[#003399] hover:underline">{link.text}</a>
                                                {j < proj.links.length - 1 && <span className="text-gray-600 px-1">|</span>}
                                            </React.Fragment>
                                        ))}
                                    </span>
                                </div>
                                <ul className="list-none space-y-[1px]">
                                    {proj.points.map((point, j) => (
                                        <li key={j} className="flex">
                                            <span className="mr-1">--</span>
                                            <span dangerouslySetInnerHTML={{ __html: point }} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Education */}
                <Section title="Education">
                    {resumeData.education.map((edu, i) => (
                        <div key={i} className="flex">
                            <div className="w-[80px] shrink-0">{edu.date}</div>
                            <div dangerouslySetInnerHTML={{ __html: edu.degree }} />
                        </div>
                    ))}
                </Section>

                {/* Certifications */}
                <Section title="Certifications">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {resumeData.certifications.map((cert, i) => (
                            <div key={i} dangerouslySetInnerHTML={{ __html: cert }} />
                        ))}
                    </div>
                </Section>

                {/* Technical Skills */}
                <Section title="Technical Skills">
                    <div className="flex flex-col gap-1">
                        {resumeData.technical_skills.map((skill, i) => (
                            <div key={i} className="flex">
                                <div className="w-[120px] shrink-0" dangerouslySetInnerHTML={{ __html: skill.category }} />
                                <div dangerouslySetInnerHTML={{ __html: skill.skills }} />
                            </div>
                        ))}
                    </div>
                </Section>

            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-2">
            <h2
                className="text-[14px] uppercase border-b border-black mb-[3px] pb-[1px]"
                style={{ fontVariant: "small-caps" }}
            >
                {title}
            </h2>
            {children}
        </div>
    );
}
