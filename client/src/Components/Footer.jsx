const Footer = () => {
    return (
      <footer className="bg-white shadow-md p-8 mt-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">
          <div>
            <h3 className="font-bold text-lg">WordScramble</h3>
            <p className="text-sm mt-2">An elegant word game designed to challenge your vocabulary and quick thinking.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">Play Game</a></li>
              <li><a href="#" className="hover:underline">Leaderboard</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg">Legal</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  