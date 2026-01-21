#!/usr/bin/env python3
"""
Find the 10 files with the most lines of code in a project.
Supports: .js, .jsx, .css, .py, .ts, .tsx, .html, .json, .md
"""

import os
import sys
from pathlib import Path
from collections import namedtuple

# Define a file info structure
FileInfo = namedtuple('FileInfo', ['path', 'lines', 'extension'])

def count_lines(file_path):
    """Count the number of lines in a file."""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return len(f.readlines())
    except Exception as e:
        print(f"Error reading {file_path}: {e}", file=sys.stderr)
        return 0

def find_top_files(project_path, top_n=10, extensions=None):
    """
    Find the top N files by line count.
    
    Args:
        project_path: Path to the project directory
        top_n: Number of top files to return (default: 10)
        extensions: List of file extensions to check (default: common web/code extensions)
    
    Returns:
        List of FileInfo tuples sorted by line count (descending)
    """
    
    if extensions is None:
        extensions = {'.js', '.jsx', '.css', '.py', '.ts', '.tsx', '.html', '.json', '.md'}
    
    files_data = []
    
    # Walk through the project directory
    for root, dirs, files in os.walk(project_path):
        # Skip common non-essential directories
        skip_dirs = {'.git', '.node_modules', 'node_modules', '__pycache__', '.venv', 'dist', 'build'}
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        
        for file in files:
            # Check if file has a relevant extension
            ext = os.path.splitext(file)[1]
            if ext in extensions:
                file_path = os.path.join(root, file)
                lines = count_lines(file_path)
                
                # Only include files with at least 1 line
                if lines > 0:
                    files_data.append(FileInfo(
                        path=file_path,
                        lines=lines,
                        extension=ext
                    ))
    
    # Sort by line count (descending) and return top N
    sorted_files = sorted(files_data, key=lambda x: x.lines, reverse=True)
    return sorted_files[:top_n]

def print_results(top_files, project_path):
    """Print the results in a nice table format."""
    
    total_lines = sum(f.lines for f in top_files)
    
    print("\n" + "="*80)
    print("TOP 10 FILES BY LINE COUNT".center(80))
    print("="*80 + "\n")
    
    print(f"{'Rank':<6} {'Lines':<8} {'Ext':<6} {'File Path':<60}")
    print("-"*80)
    
    for rank, file_info in enumerate(top_files, 1):
        # Make path relative to project root for readability
        try:
            rel_path = os.path.relpath(file_info.path, project_path)
        except ValueError:
            rel_path = file_info.path
        
        # Truncate path if too long
        if len(rel_path) > 59:
            rel_path = "..." + rel_path[-56:]
        
        print(f"{rank:<6} {file_info.lines:<8} {file_info.extension:<6} {rel_path:<60}")
    
    print("-"*80)
    print(f"{'TOTAL':<6} {total_lines:<8}")
    print("\n" + "="*80 + "\n")

def main():
    """Main entry point."""
    
    # Get project path from command line or use current directory
    if len(sys.argv) > 1:
        project_path = sys.argv[1]
    else:
        project_path = os.getcwd()
    
    # Verify project path exists
    if not os.path.isdir(project_path):
        print(f"Error: {project_path} is not a valid directory", file=sys.stderr)
        sys.exit(1)
    
    print(f"Scanning project: {os.path.abspath(project_path)}\n")
    print("Counting lines in files...")
    
    # Find top 10 files
    top_files = find_top_files(project_path, top_n=10)
    
    if not top_files:
        print("No code files found.", file=sys.stderr)
        sys.exit(1)
    
    # Print results
    print_results(top_files, project_path)
    
    # Print breakdown by extension
    extension_count = {}
    for file_info in top_files:
        ext = file_info.extension
        if ext not in extension_count:
            extension_count[ext] = 0
        extension_count[ext] += file_info.lines
    
    print("Breakdown by File Type:")
    print("-"*40)
    for ext in sorted(extension_count.keys()):
        lines = extension_count[ext]
        print(f"{ext:<10} {lines:>10} lines")
    print()

if __name__ == "__main__":
    main()