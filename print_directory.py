import os

def print_tree(startpath, output_filename="structure.txt"):
    # Always write the output file in the same directory as this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, output_filename)

    with open(output_path, "w") as f:
        for root, dirs, files in os.walk(startpath):
            level = root.replace(startpath, '').count(os.sep)
            indent = '    ' * level
            f.write(f"{indent}{os.path.basename(root)}/\n")
            subindent = '    ' * (level + 1)
            for file in files:
                f.write(f"{subindent}{file}\n")

    print(f"✅ Directory structure saved to: {output_path}")

if __name__ == "__main__":
    import sys
    folder_to_scan = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    print_tree(folder_to_scan)
