import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useState, useEffect, createContext } from "react";

type ActiveLinkContextType = {
  className?: string;
};

const ActiveLinkContext = createContext<ActiveLinkContextType>({});

type ActiveLinkProps = LinkProps & {
  className?: string;
  activeClassName: string;
};

const ActiveLink = ({
  children,
  activeClassName,
  className,
  ...props
}: PropsWithChildren<ActiveLinkProps>) => {
  const pathname = usePathname();
  const [computedClassName, setComputedClassName] = useState(className);

  useEffect(() => {
    const linkPathname = new URL((props.as || props.href) as string, location.href).pathname;

    const activePathname = new URL(pathname, location.href).pathname;

    const newClassName =
      linkPathname === activePathname ? `${className} ${activeClassName}`.trim() : className;

    if (newClassName !== computedClassName) {
      setComputedClassName(newClassName);
    }
  }, [pathname, props.as, props.href, activeClassName, className, computedClassName]);

  return (
    <ActiveLinkContext.Provider value={{ className: computedClassName }}>
      <Link className={computedClassName} {...props}>
        {children}
      </Link>
    </ActiveLinkContext.Provider>
  );
};

export { ActiveLink, ActiveLinkContext };
