const Notification = () => {
    return (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900 shadow-sm">
            <p className="font-semibold">Try the app without signing up</p>
            <p className="mt-1">
                Use the following test account to log in:
            </p>
            <div className="mt-2 space-y-1">
                <p>
                    <span className="font-medium">Email:</span>{" "}
                    <span className="font-mono">test@gmail.com</span>
                </p>
                <p>
                    <span className="font-medium">Password:</span>{" "}
                    <span className="font-mono">12345678</span>
                </p>
            </div>
        </div>
    );
};

export default Notification;