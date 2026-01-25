import { Icons } from 'src/components/common';
import './Header.css';
import { ThemeToggle } from 'src/components/common/ThemeToggle';

const Header = ({
	user,
	taskCount,
	filteredCount,
	showFilter,
	onToggleFilter,
	onLogout,
	onDownload,
}) => {
	return (
		<header className="header">
			<div className="header-left">
				<span className="header-welcome">Welcome back,</span>
				<h1 className="header-title">{user}</h1>
			</div>
			<div className="header-right">
				<ThemeToggle />
				{taskCount > 0 && (
					<span className="header-stats">
						{filteredCount}/{taskCount} tasks
					</span>
				)}

				<button className="header-btn" onClick={onDownload} title="Download tasks">
					<Icons.Download />
				</button>
				<button
					className="header-btn"
					onClick={onToggleFilter}
					title={showFilter ? 'Hide filter' : 'Show filter'}
				>
					{showFilter ? <Icons.X /> : <Icons.Filter />}
				</button>
				<button className="header-btn" onClick={onLogout} title="Logout">
					<Icons.Logout />
				</button>
			</div>
		</header>
	);
};

export default Header;
