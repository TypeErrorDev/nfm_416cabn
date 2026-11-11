function Navbar() {
    return (
        <nav className="outline-1 outline-blue-400 h-15 p-8 flex items-center justify-around w-full">
            <div className="container mx-auto flex items-center font-cap">
                <div className="text-ink font-bold text-xl mr-5">Norwegian Foot March </div>
                <div className="text-[15px] text-brass-dim">Oceanside, California</div>

            </div>
            <div className="space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">Home</a>
                <a href="#" className="text-gray-300 hover:text-white">About</a>
                <a href="#" className="text-gray-300 hover:text-white">Contact</a>
            </div>
        </nav>
    );
}

export default Navbar;