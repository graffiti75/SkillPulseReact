import { Icons } from 'src/components/common';
import { ThemeToggle } from 'src/components/common/ThemeToggle';
import { useMenu } from 'src/contexts/MenuContext';
import './Menu.css';

const Menu = ({ user, showFilter, onToggleFilter, onLogout, onDownload }) => {
	const { isMenuOpen, setIsMenuOpen } = useMenu();

	const handleMenuToggle = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleMenuItemClick = (callback) => {
		callback();
		setIsMenuOpen(false);
	};

	return (
		<div className="menu-container">
			<button className="menu-toggle" onClick={handleMenuToggle} title="Menu">
				<Icons.Menu />
			</button>

			{isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />}

			<div className={`menu ${isMenuOpen ? 'menu-open' : ''}`}>
				<div className="menu-header">
					<h2 className="menu-user">{user}</h2>
					<button
						className="menu-close"
						onClick={() => setIsMenuOpen(false)}
						title="Close menu"
					>
						<Icons.X />
					</button>
				</div>

				<div className="menu-divider" />

				<div className="menu-content">
					<div className="menu-section">
						<label className="menu-section-title">Theme</label>
						<div className="menu-item">
							<ThemeToggle />
						</div>
					</div>

					<div className="menu-section">
						<label className="menu-section-title">Actions</label>
						<button
							className="menu-item"
							onClick={() => handleMenuItemClick(onDownload)}
							title="Download tasks"
						>
							<Icons.Download />
							<span>Download Tasks</span>
						</button>
						<button
							className="menu-item"
							onClick={() => handleMenuItemClick(() => onToggleFilter())}
							title={showFilter ? 'Hide filter' : 'Show filter'}
						>
							{showFilter ? <Icons.X /> : <Icons.Filter />}
							<span>{showFilter ? 'Hide Filter' : 'Show Filter'}</span>
						</button>
					</div>

					<div className="menu-divider" />

					<button
						className="menu-item menu-logout"
						onClick={() => handleMenuItemClick(onLogout)}
						title="Logout"
					>
						<Icons.Logout />
						<span>Logout</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Menu;
