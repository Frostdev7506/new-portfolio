"use client";

import { motion, Variants } from "framer-motion";
import { BlogPost } from "@/lib/posts";
import { BlogPostCard } from "@/components/blog/blog-post-card";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
};

export function BlogClientContent({ posts }: { posts: BlogPost[] }) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-0 relative z-10"
        >
            {posts.map((post) => (
                <motion.div key={post.slug} variants={itemVariants}>
                    <BlogPostCard post={post} />
                </motion.div>
            ))}
        </motion.div>
    );
}
