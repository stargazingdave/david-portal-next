import { HomePage } from "@/features/portfolio/components/home-page";
import { projects } from "@/features/portfolio/data/projects";

export default function Home() {
    return <HomePage projects={projects} />;
}
