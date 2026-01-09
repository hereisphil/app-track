const Footer = ({ children }: React.PropsWithChildren) => {
    return (
        <footer className="bg-teal-400 py-4 mt-10 text-sm text-white text-center">
            {children}
        </footer>
    );
};

export default Footer;
