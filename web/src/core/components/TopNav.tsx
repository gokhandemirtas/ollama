import "./TopNav.css";

import { BeakerIcon } from "@heroicons/react/16/solid";

export default function TopNav() {
  return (
    <>
      <header>
        <div className="container mx-auto">
          <nav className="flex items-center justify-between py-4">
            <figure className="flex justify-between">
              <BeakerIcon className="size-6 h-4" />
              <figcaption className="text-sm/4 font-bold">LoreXplore</figcaption>
            </figure>
            <nav>
              <a href="/prompt">Prompt</a>
              <a href="/admin">Admin</a>
            </nav>
          </nav>
        </div>
      </header>
    </>
  )
}
