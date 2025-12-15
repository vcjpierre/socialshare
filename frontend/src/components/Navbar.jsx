import PropTypes from "prop-types";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ searchTerm, setSearchTerm, user }) {
	const navigate = useNavigate();

	return (
		<div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
			<div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm">
				<IoMdSearch fontSize={21} className="ml-1" />
				<input
					type="text"
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Search"
					value={searchTerm}
					onFocus={() => navigate("/search")}
					className="p-2 w-full bg-white outline-none"
				/>
			</div>
			<div className="flex gap-3">
				{user ? (
					<>
						<Link to={`/user-profile/${user._id}`} className="hidden md:block">
							<img src={user.image} alt="user" className="w-14 h-12 rounded-lg" />
						</Link>
						<Link
							to="/create-pin"
							className="bg-black text-white rounded-lg w-12 h-12 md:w-14 flex justify-center items-center"
						>
							<IoMdAdd />
						</Link>
					</>
				) : (
					<Link
						to="/login"
						className="bg-black text-white rounded-lg px-6 py-3 h-12 md:h-12 flex justify-center items-center font-semibold whitespace-nowrap"
					>
						Sign In
					</Link>
				)}
			</div>
		</div>
	);
}

Navbar.propTypes = {
	searchTerm: PropTypes.string,
	setSearchTerm: PropTypes.func,
	user: PropTypes.shape({
		_id: PropTypes.string,
		image: PropTypes.string,
	}),
};
