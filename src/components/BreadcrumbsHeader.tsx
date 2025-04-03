import { Link } from "@tanstack/react-router";

interface BreadcrumbsHeaderProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export function BreadcrumbsHeader({ items }: BreadcrumbsHeaderProps) {
  return (
    <div>
      <header className="bg-white px-6 py-4 shadow-sm">
        <nav className="breadcrumbs">
          <ol className="flex flex-wrap items-center text-sm">
            {items.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                {item.href ? (
                  <Link
                    to={item.href}
                    className="text-gray-600 transition duration-200 hover:text-blue-500"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-gray-900">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </header>
    </div>
  );
}
