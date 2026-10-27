import { Link } from "@tanstack/react-router";
import { Logo, btn } from "./primitives";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-30 bg-header text-header-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/"><Logo /></Link>
        <nav className="hidden items-center gap-7 text-sm text-header-foreground/80 md:flex">
          <a href="#how" className="hover:text-header-foreground">How it works</a>
          <a href="#who" className="hover:text-header-foreground">Who it's for</a>
          <a href="#trust" className="hover:text-header-foreground">Trust</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/signin" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-header-foreground/10">Sign in</Link>
          <Link to="/signup" className={btn.primary}>Join CollabLevel</Link>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="bg-header text-header-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-2 max-w-xs text-sm text-header-foreground/70">Credibility built through real collaboration, not follower counts.</p>
        </div>
        <div className="flex gap-6 text-sm text-header-foreground/80">
          <Link to="/signup" className="hover:text-header-foreground">Create account</Link>
          <Link to="/signin" className="hover:text-header-foreground">Sign in</Link>
        </div>
        <p className="text-xs text-header-foreground/60">© 2026 CollabLevel</p>
      </div>
    </footer>
  );
}
