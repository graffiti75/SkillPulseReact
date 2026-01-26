import Menu from './Menu';
import './Header.css';

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
			<Menu
				user={user}
				showFilter={showFilter}
				onToggleFilter={onToggleFilter}
				onLogout={onLogout}
				onDownload={onDownload}
			/>
			<div className="header-center">
				{taskCount > 0 && (
					<span className="header-stats">
						{filteredCount}/{taskCount} tasks
					</span>
				)}
			</div>
			<div className="header-spacer" />
		</header>
	);
};

export default Header;
