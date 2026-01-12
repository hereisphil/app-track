import { useState } from "react";
import toast from "react-hot-toast";
import { IoIosClose } from "react-icons/io";

const AddOpportunity = () => {
    const [showForm, setShowForm] = useState(false);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setShowForm(false);
        toast.success("Opportunity added!");
    }

    return (
        <>
            <button
                type="button"
                className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
                onClick={() => setShowForm(!showForm)}
            >
                Add Opportunity
            </button>
            {showForm && (
                <div
                    className="fixed bg-black/50 min-h-screen z-10 w-screen flex justify-center items-center top-0 left-0"
                    onClick={() => setShowForm(!showForm)}
                >
                    <form
                        className="flex flex-col gap-4 bg-white rounded px-8 py-6 min-w-lg relative"
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleSubmit}
                    >
                        <h3 className="text-center font-bold text-xl mb-4">
                            Where did you apply?
                        </h3>
                        <input
                            type="text"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            placeholder="Company Name"
                            required
                        />
                        <input
                            type="text"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            placeholder="Position Title"
                            required
                        />
                        <input
                            type="text"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            placeholder="Location"
                        />
                        <input
                            type="text"
                            className="border-2 border-gray-300 px-4 py-2 rounded-md"
                            placeholder="Job Posting Website"
                        />
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
                            >
                                Submit
                            </button>
                            <button
                                type="submit"
                                className="bg-gray-300 text-white px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setShowForm(!showForm)}
                            >
                                Cancel
                            </button>
                        </div>
                        <IoIosClose
                            className="cursor-pointer absolute top-4 right-4"
                            onClick={() => setShowForm(!showForm)}
                            size={30}
                        />
                    </form>
                </div>
            )}
        </>
    );
};
export default AddOpportunity;
