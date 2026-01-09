interface HeaderProps {
    signup: {
        title: string;
        href: string;
    };
}

const Header = ({ signup }: HeaderProps) => {
    return (
        <header className="bg-teal-400 px-4 py-8 mb-4 font-semibold flex justify-between">
            <h2 className="text-xl text-white">App Track</h2>
            <a href={signup.href}>{signup.title}</a>
        </header>
    );
};

export default Header;
