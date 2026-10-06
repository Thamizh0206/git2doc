import fitz  # PyMuPDF
import re

def generate_pdf(input_file="content.txt", output_file="simple_document.pdf"):
    """
    Generate a formatted PDF from a text file with markdown-style formatting.
    
    Args:
        input_file: Path to the input text file
        output_file: Path to the output PDF file
    """
    # Create document
    doc = fitz.open()

    # Page size
    width, height = fitz.paper_size("a4")

    # Margins and indentation
    margin = 50
    base_indent = margin
    list_indent = 20  # Additional indent for list items
    nested_indent = 15  # Additional indent for nested content
    
    # Font sizes
    main_heading_fontsize = 19.5  # # heading
    sub_heading_fontsize = 12     # ## heading
    body_fontsize = 10.5

    # Read text
    with open(input_file, "r", encoding="utf-8") as f:
        text = f.read()

    # Helper variables for manual layout
    x = base_indent
    y = margin

    # Initial page
    page = doc.new_page(width=width, height=height)
    
    # Function to draw page border
    def draw_page_border(page):
        """Draw a decorative border around the page"""
        border_margin = 20  # Distance from page edge
        border_color = (0.2, 0.2, 0.2)  # Dark gray
        border_width = 1.5
        
        # Outer border rectangle
        outer_rect = fitz.Rect(border_margin, border_margin, 
                              width - border_margin, height - border_margin)
        page.draw_rect(outer_rect, color=border_color, width=border_width)
        
        # Inner accent line (slightly inside the outer border)
        inner_margin = border_margin + 3
        inner_rect = fitz.Rect(inner_margin, inner_margin,
                              width - inner_margin, height - inner_margin)
        page.draw_rect(inner_rect, color=(0.5, 0.5, 0.5), width=0.5)
    
    # Draw border on the initial page
    draw_page_border(page)
    
    # Counter for numbered lists
    list_counter = {}  # Track counters for different list levels

    # Function to get heading level
    def get_heading_level(line):
        """Returns the heading level (1 for #, 2 for ##, etc.) or 0 if not a heading"""
        match = re.match(r'^(#+)\s', line.strip())
        return len(match.group(1)) if match else 0

    # Function to clean heading (remove # symbols)
    def clean_heading(line):
        return re.sub(r'^#+\s*', '', line.strip())

    # Function to check if line is a bullet/list item
    def is_list_item(line):
        """Check if line starts with *, -, or numbered list"""
        stripped = line.strip()
        return stripped.startswith('*') or stripped.startswith('-') or re.match(r'^\d+\.', stripped)
    
    # Function to check if line already has a number
    def has_existing_number(line):
        """Check if line already starts with a number"""
        stripped = line.strip()
        return bool(re.match(r'^\d+\.', stripped))
    
    # Function to get indentation level
    def get_indent_level(line):
        """Count leading spaces/tabs to determine indentation level"""
        return len(line) - len(line.lstrip())

    # Function to clean markdown symbols from text
    def clean_markdown_symbols(text):
        """Remove backticks, code fences, and other markdown artifacts from text"""
        if not text:
            return text
        
        # Remove inline code backticks
        text = re.sub(r'`([^`]+)`', r'\1', text)
        
        # Remove any remaining standalone backticks
        text = text.replace('`', '')
        
        # Remove code fence markers (```)
        text = re.sub(r'```\w*', '', text)
        
        # Remove any extra markdown symbols that shouldn't be in final text
        # Keep ** and __ for bold parsing, but remove orphaned ones
        
        return text
    
    # Function to parse bold text (**text** or __text__)
    def parse_bold_segments(text):
        """Returns list of (text, is_bold) tuples"""
        # First clean markdown symbols except bold markers
        text = clean_markdown_symbols(text)
        
        segments = []
        # Split by ** or __ markers
        parts = re.split(r'(\*\*.*?\*\*|__.*?__)', text)
        
        for part in parts:
            if part.startswith('**') and part.endswith('**'):
                segments.append((part[2:-2], True))
            elif part.startswith('__') and part.endswith('__'):
                segments.append((part[2:-2], True))
            elif part:
                segments.append((part, False))
        
        return segments

    # Function to check if line is an image
    def is_image_line(line):
        """Check if line contains markdown image syntax: ![alt text](path)"""
        return bool(re.match(r'!\[.*?\]\(.+?\)', line.strip()))
    
    # Function to extract image info from markdown
    def extract_image_info(line):
        """Extract alt text and path from markdown image"""
        match = re.match(r'!\[(.*?)\]\((.+?)\)', line.strip())
        if match:
            return match.group(1), match.group(2)  # alt_text, image_path
        return None, None
    
    # Function to check if line is a blockquote (potential info box)
    def is_blockquote(line):
        """Check if line starts with > (markdown blockquote)"""
        return line.strip().startswith('>')
    
    # Function to extract blockquote content
    def extract_blockquote_content(line):
        """Remove > prefix from blockquote"""
        return line.strip()[1:].strip()
    
    # Function to check if line starts a code block
    def is_code_fence(line):
        """Check if line is a code fence (``` or ~~~)"""
        stripped = line.strip()
        return stripped.startswith('```') or stripped.startswith('~~~')
    

    # Function to draw a box with border (for callouts, code blocks, etc.)
    def draw_box(page, x_pos, y, width_val, height_val, fill_color=None, border_color=(0, 0, 0), border_width=1):
        """Draw a rectangle box with optional fill and border"""
        rect = fitz.Rect(x_pos, y, x_pos + width_val, y + height_val)
        
        # Draw filled rectangle if fill color provided
        if fill_color:
            page.draw_rect(rect, color=None, fill=fill_color, width=0)
        
        # Draw border
        if border_color and border_width > 0:
            page.draw_rect(rect, color=border_color, fill=None, width=border_width)
        
        return rect
    
    # Function to insert an info box (for important notes)
    def insert_info_box(page, doc, x_pos, y, text_content, box_width, box_type="info"):
        """
        Insert a highlighted box with text for important information
        box_type can be: 'info' (blue), 'warning' (yellow), 'important' (red), 'tip' (green), 'code' (gray)
        """
        padding = 10
        fontsize = body_fontsize
        line_height = fontsize * 1.4
        
        # Define box colors based on type
        box_styles = {
            "info": {
                "fill": (0.85, 0.92, 0.98),      # Light blue
                "border": (0.13, 0.58, 0.84),    # Blue
                "title": "INFO"
            },
            "warning": {
                "fill": (1.0, 0.96, 0.8),         # Light yellow
                "border": (0.95, 0.77, 0.06),     # Yellow/Orange
                "title": "WARNING"
            },
            "important": {
                "fill": (0.99, 0.89, 0.89),       # Light red
                "border": (0.86, 0.15, 0.15),     # Red
                "title": "IMPORTANT"
            },
            "tip": {
                "fill": (0.88, 0.97, 0.88),       # Light green
                "border": (0.16, 0.66, 0.36),     # Green
                "title": "TIP"
            },
            "code": {
                "fill": (0.95, 0.95, 0.95),       # Light gray
                "border": (0.4, 0.4, 0.4),        # Dark gray
                "title": "CODE"
            }
        }
        
        style = box_styles.get(box_type, box_styles["info"])
        
        # Calculate text wrapping
        words = text_content.split()
        lines = []
        current_line = ""
        max_text_width = box_width - (2 * padding)
        
        for word in words:
            test_line = current_line + (" " if current_line else "") + word
            text_width = fitz.get_text_length(test_line, fontsize=fontsize, fontname="helv")
            
            if text_width > max_text_width and current_line:
                lines.append(current_line)
                current_line = word
            else:
                current_line = test_line
        
        if current_line:
            lines.append(current_line)
        
        # Calculate box height (title + content lines + padding)
        title_height = (fontsize + 2) * 1.5
        content_height = len(lines) * line_height
        box_height = title_height + content_height + (2 * padding) + 5
        
        # Check if we need a new page
        if y + box_height > height - margin:
            page = doc.new_page(width=width, height=height)
            draw_page_border(page)
            y = margin
        
        # Draw the box
        draw_box(page, x_pos, y, box_width, box_height, 
                fill_color=style["fill"], 
                border_color=style["border"], 
                border_width=2)
        
        # Draw title bar
        title_bar_height = title_height
        draw_box(page, x_pos, y, box_width, title_bar_height, 
                fill_color=style["border"], 
                border_color=None, 
                border_width=0)
        
        # Insert title text
        title_text = f"{style['title']}"
        page.insert_text((x_pos + padding, y + title_height - 5), 
                        title_text, 
                        fontsize=fontsize + 1, 
                        fontname="hebo", 
                        color=(1, 1, 1))  # White text
        
        # Insert content lines
        content_y = y + title_bar_height + padding
        for line in lines:
            page.insert_text((x_pos + padding, content_y), 
                            line, 
                            fontsize=fontsize, 
                            fontname="helv")
            content_y += line_height
        
        # Return new y position with increased spacing after box
        return page, doc, y + box_height + (fontsize * 1.8)  # Balanced spacing after info boxes
    
    # Function to insert highlighted code block
    def insert_code_block(page, doc, x_pos, y, code_lines, box_width):
        """Insert a code block with syntax highlighting background"""
        padding = 12
        code_fontsize = body_fontsize - 0.5
        line_height = code_fontsize * 1.5
        
        # Calculate box height
        box_height = (len(code_lines) * line_height) + (2 * padding)
        
        # Check if we need a new page
        if y + box_height > height - margin:
            page = doc.new_page(width=width, height=height)
            draw_page_border(page)
            y = margin
        
        # Draw code box with dark background
        draw_box(page, x_pos, y, box_width, box_height,
                fill_color=(0.13, 0.13, 0.13),  # Dark gray background
                border_color=(0.3, 0.5, 0.7),    # Blue border
                border_width=1.5)
        
        # Insert code lines
        code_y = y + padding + code_fontsize
        for line in code_lines:
            # Use monospace font for code
            page.insert_text((x_pos + padding, code_y),
                            line,
                            fontsize=code_fontsize,
                            fontname="cour",  # Courier (monospace)
                            color=(0.8, 0.95, 0.8))  # Light green text
            code_y += line_height
        
        return page, doc, y + box_height + (body_fontsize * 1.8)  # Balanced spacing after code blocks
    
    # Function to insert image into PDF
    def insert_image(page, doc, x_pos, y, image_path, max_width):
        """Insert an image into the PDF and return updated page, doc, and y position"""
        try:
            import os
            if not os.path.exists(image_path):
                # Try relative path from the current directory
                if not os.path.isabs(image_path):
                    image_path = os.path.join(os.getcwd(), image_path)
                
                if not os.path.exists(image_path):
                    raise FileNotFoundError(f"Image not found: {image_path}")
            
            # Open the image to get its dimensions
            from PIL import Image
            img = Image.open(image_path)
            img_width, img_height = img.size
            
            # Scale to fit within both page width and page height
            available_height = height - (2 * margin)
            scale = min(1.0, max_width / img_width, available_height / img_height)
            
            scaled_height = img_height * scale
            if y + scaled_height > height - margin:
                # Need a new page
                page = doc.new_page(width=width, height=height)
                draw_page_border(page)
                y = margin
            
            # Insert the image
            img_rect = fitz.Rect(x_pos, y, x_pos + (img_width * scale), y + scaled_height)
            page.insert_image(img_rect, filename=image_path)
            
            # Move y position down
            y += scaled_height + 10  # Add some spacing after image
            
            return page, doc, y
        except Exception as e:
            doc.close()
            raise RuntimeError(f"Failed to insert image {image_path}: {e}") from e

    # Function to insert text with proper formatting
    def insert_formatted_line(page, doc, x_pos, y, line, heading_level=0, indent_level=0, list_number=None, preserve_number=False):
        """Insert a formatted line and return updated page, doc, and y position"""
        
        # Determine font size based on heading level
        if heading_level == 1:
            # Main heading (#)
            fontsize = main_heading_fontsize
            line_height = fontsize * 1.5
            fontname = "hebo"
            text_content = clean_markdown_symbols(clean_heading(line))
        elif heading_level == 2:
            # Subheading (##)
            fontsize = sub_heading_fontsize
            line_height = fontsize * 1.4
            fontname = "hebo"
            text_content = clean_markdown_symbols(clean_heading(line))
        elif heading_level >= 3:
            # Smaller headings (###, ####, etc.)
            fontsize = body_fontsize + 1  # Slightly larger than body
            line_height = fontsize * 1.4
            fontname = "hebo"  # Still bold
            text_content = clean_markdown_symbols(clean_heading(line))
        else:
            # Body text
            fontsize = body_fontsize
            line_height = fontsize * 1.4
            fontname = "helv"
            text_content = line.strip()
            
            # Handle list items
            if preserve_number:
                # Keep existing number from markdown
                text_content = text_content
            elif list_number is not None:
                # Add new number for bullet points
                text_content = f"{list_number}. {text_content.lstrip('*-').strip()}"
        
        # Calculate x position with indentation
        current_x = x_pos + (indent_level * nested_indent)
        if list_number is not None:
            current_x += list_indent
        
        # Calculate max width ensuring proper right margin
        # max_width should be: page_width - left_margin - current_x - right_margin
        max_width = width - current_x - margin
        
        # For headings, wrap to multiple lines if needed (left-aligned)
        if heading_level > 0:
            words = text_content.split(" ")
            line_text = ""
            
            for i, word in enumerate(words):
                test_text = line_text + (" " if line_text else "") + word
                text_width = fitz.get_text_length(test_text, fontsize=fontsize, fontname=fontname)
                
                if text_width > max_width and line_text:
                    # Insert current line
                    page.insert_text((current_x, y), line_text, fontsize=fontsize, fontname=fontname)
                    y += line_height
                    line_text = word
                    
                    # Check if we need a new page
                    if y > height - margin:
                        page = doc.new_page(width=width, height=height)
                        draw_page_border(page)
                        y = margin
                else:
                    line_text = test_text
            
            # Insert remaining text
            if line_text:
                page.insert_text((current_x, y), line_text, fontsize=fontsize, fontname=fontname)
            
            return page, doc, y + line_height
        
        # For body text, use textbox with justified alignment
        segments = parse_bold_segments(text_content)
        
        # Build the complete text with formatting
        full_text = ""
        for text, is_bold in segments:
            full_text += text
        
        # Create a text rectangle for justified text
        text_rect = fitz.Rect(current_x, y - fontsize, current_x + max_width, height - margin)
        
        # Insert text with justified alignment (align=3 means justify)
        # For mixed bold/normal text, we need to handle it differently
        if len(segments) == 1 and not segments[0][1]:
            # Simple case: no bold text
            result = page.insert_textbox(text_rect, full_text, 
                                        fontsize=fontsize, 
                                        fontname="helv",
                                        align=fitz.TEXT_ALIGN_JUSTIFY)
            
            if result > 0:
                # Text fit - calculate actual height used
                # More conservative calculation: account for word wrapping by using 0.95 multiplier
                total_text_width = fitz.get_text_length(full_text, fontsize=fontsize, fontname="helv")
                estimated_lines = max(1, (total_text_width / max_width) * 0.95)
                # Reduce spacing for list items - use smaller base multiplier
                if indent_level > 0 or list_number is not None or preserve_number:
                    spacing = estimated_lines * line_height + (line_height * 0.9)  # Prevent multi-line overlap
                else:
                    spacing = estimated_lines * line_height + (line_height * 1.0)  # Normal paragraph spacing
                y += spacing
            else:
                # Text didn't fit, need new page
                page = doc.new_page(width=width, height=height)
                draw_page_border(page)
                y = margin
                text_rect = fitz.Rect(current_x, y - fontsize, current_x + max_width, height - margin)
                page.insert_textbox(text_rect, full_text, 
                                   fontsize=fontsize, 
                                   fontname="helv",
                                   align=fitz.TEXT_ALIGN_JUSTIFY)
                total_text_width = fitz.get_text_length(full_text, fontsize=fontsize, fontname="helv")
                estimated_lines = max(1, (total_text_width / max_width) * 0.95)
                # Reduce spacing for list items - use smaller base multiplier  
                if indent_level > 0 or list_number is not None or preserve_number:
                    spacing = estimated_lines * line_height + (line_height * 0.9)  # Prevent multi-line overlap
                else:
                    spacing = estimated_lines * line_height + (line_height * 1.0)  # Normal paragraph spacing
                y += spacing
        else:
            # Complex case: has bold text - manually justify
            start_y = y  # Track starting position to calculate lines used
            
            for text, is_bold in segments:
                words = text.split(" ")
                
                for word in words:
                    word_with_space = word if current_x == x_pos + (indent_level * nested_indent) + (list_indent if list_number else 0) else " " + word
                    
                    fontname = "hebo" if is_bold else "helv"
                    word_width = fitz.get_text_length(word_with_space, fontsize=fontsize, fontname=fontname)
                    
                    # Check if word exceeds the available width (using corrected max_width)
                    if current_x + word_width > width - margin and current_x > x_pos + (indent_level * nested_indent):
                        # Move to next line
                        y += line_height
                        current_x = x_pos + (indent_level * nested_indent) + (list_indent if list_number else 0)
                        word_with_space = word
                        
                        # Check if we need a new page
                        if y > height - margin:
                            page = doc.new_page(width=width, height=height)
                            draw_page_border(page)
                            y = margin
                            start_y = y  # Reset start_y for new page
                            current_x = x_pos + (indent_level * nested_indent) + (list_indent if list_number else 0)
                    
                    # Insert word
                    page.insert_text((current_x, y), word_with_space, fontsize=fontsize, fontname=fontname)
                    current_x += fitz.get_text_length(word_with_space, fontsize=fontsize, fontname=fontname)
            
            # Calculate how many lines were actually used
            lines_used = max(1, ((y - start_y) / line_height) + 1)
            
            # Add spacing based on content type - NOW USING lines_used!
            if indent_level > 0 or list_number is not None or preserve_number:
                # List item - spacing proportional to actual lines used
                # For 1 line: adds ~0.5 line height
                # For 2 lines: adds ~0.7 line height  
                # For 3 lines: adds ~0.9 line height
                y += line_height * (0.3 + (lines_used * 0.8))
            else:
                # Regular paragraph
                y += line_height + (line_height * 0.8)
        
        return page, doc, y

    # Process lines
    lines = text.splitlines()
    current_list_level = 0
    skip_lines = 0  # Counter to skip multiple lines (blank + caption)

    for i, line in enumerate(lines):
        # Skip if this line should be skipped (e.g., image caption)
        if skip_lines > 0:
            skip_lines -= 1
            continue
        
        # Check if this is an image line
        if is_image_line(line):
            alt_text, image_path = extract_image_info(line)
            
            # Add some spacing before image
            y += body_fontsize
            
            # Insert the image
            max_image_width = width - (2 * margin)
            page, doc, y = insert_image(page, doc, x, y, image_path, max_image_width)
            
            
            # Check if next line (or line after blank) is a caption
            caption_found = False
            caption_offset = 0
            
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                # Check if i+1 is the caption
                if next_line and ((next_line.startswith('*') and not next_line.startswith('**')) or \
                                  'Figure:' in next_line or 'figure:' in next_line):
                    caption_found = True
                    caption_offset = 1
                # If i+1 is blank, check i+2
                elif not next_line and i + 2 < len(lines):
                    next_next_line = lines[i + 2].strip()
                    if next_next_line and ((next_next_line.startswith('*') and not next_next_line.startswith('**')) or \
                                           'Figure:' in next_next_line or 'figure:' in next_next_line):
                        caption_found = True
                        caption_offset = 2
            
            if caption_found:
                # Get caption from the correct line
                caption_text = lines[i + caption_offset].strip('*').strip()
                caption_text = re.sub(r'^\d+\.\s*', '', caption_text)
                
                if y > height - margin:
                    page = doc.new_page(width=width, height=height)
                    draw_page_border(page)
                    y = margin
                
                # Insert caption centered
                caption_width = fitz.get_text_length(caption_text, fontsize=body_fontsize - 1, fontname="heit")
                caption_x = (width - caption_width) / 2
                page.insert_text((caption_x, y), caption_text, fontsize=body_fontsize - 1, fontname="heit")
                y += body_fontsize * 1.2
                
                # Skip caption line(s)
                skip_lines = caption_offset
            
            # Add minimal spacing after image (reduced significantly)
            y += body_fontsize * 0.2  # Reduced from 0.5
            continue
        
        # Check for code block start
        if is_code_fence(line):
            # Collect all code lines until closing fence
            code_lines = []
            j = i + 1
            while j < len(lines) and not is_code_fence(lines[j]):
                code_lines.append(lines[j])
                j += 1
            
            # Insert code block
            if code_lines:
                box_width = width - (2 * margin)
                page, doc, y = insert_code_block(page, doc, x, y, code_lines, box_width)
            
            # Skip the code lines we just processed
            skip_lines = j - i
            continue
        
        # Check for blockquote (convert to info box)
        if is_blockquote(line):
            # Collect consecutive blockquote lines
            blockquote_text = extract_blockquote_content(line)
            j = i + 1
            while j < len(lines) and is_blockquote(lines[j]):
                blockquote_text += " " + extract_blockquote_content(lines[j])
                j += 1
            
            # Determine box type from content
            box_type = "info"  # Default
            content_lower = blockquote_text.lower()
            
            # Check for special keywords to determine box type
            if any(keyword in content_lower for keyword in ["warning", "caution", "alert"]):
                box_type = "warning"
            elif any(keyword in content_lower for keyword in ["important", "critical", "note", "key"]):
                box_type = "important"
            elif any(keyword in content_lower for keyword in ["tip", "hint", "pro tip", "suggestion"]):
                box_type = "tip"
            elif any(keyword in content_lower for keyword in ["code", "example", "snippet"]):
                box_type = "code"
            
            # Clean up the type prefix if present in text
            for prefix in ["warning:", "important:", "tip:", "note:", "info:"]:
                if blockquote_text.lower().startswith(prefix):
                    blockquote_text = blockquote_text[len(prefix):].strip()
                    break
            
            # Insert info box
            box_width = width - (2 * margin)
            page, doc, y = insert_info_box(page, doc, x, y, blockquote_text, box_width, box_type)
            
            # Skip the blockquote lines we just processed
            skip_lines = (j - i - 1)
            continue
        

        # Skip empty lines but add minimal spacing
        # Track consecutive empty lines to avoid accumulating spacing
        if not line.strip():
            # Only add spacing if we haven't just processed an empty line
            if i == 0 or lines[i-1].strip() != '':
                y += body_fontsize * 0.15  # Drastically reduced from 0.4
            current_list_level = 0  # Reset list counter on empty line
            list_counter = {}
            continue
        
        # Check if we need a new page before processing
        if y > height - margin - 30:  # Leave some buffer
            page = doc.new_page(width=width, height=height)
            draw_page_border(page)
            y = margin
        
        # Determine line type and formatting
        heading_level = get_heading_level(line)
        indent_level = get_indent_level(line) // 4  # Assume 4 spaces per indent level
        
        if heading_level > 0:
            # Calculate space needed for heading + minimum body lines
            heading_fontsize = main_heading_fontsize if heading_level == 1 else sub_heading_fontsize
            space_before_heading = heading_fontsize * (0.5 if heading_level == 1 else 0.3)
            space_for_heading = heading_fontsize * 1.5
            space_for_body_preview = body_fontsize * 10  # Increased to 10 lines to keep heading with body
            total_space_needed = space_before_heading + space_for_heading + space_for_body_preview
            
            # Check if heading + some body content would fit on current page
            # If not, start a new page to keep heading with its content
            if y + total_space_needed > height - margin:
                page = doc.new_page(width=width, height=height)
                draw_page_border(page)
                y = margin
            
            # Add extra spacing before headings (only if not at top of page)
            if y > margin + 10:
                if heading_level == 1:
                    y += main_heading_fontsize * 0.3  # Main headings: minimal spacing
                else:
                    y += sub_heading_fontsize * 1.0  # Subheadings: one extra line of space
            
            page, doc, y = insert_formatted_line(page, doc, x, y, line, heading_level=heading_level)
            
            # Add minimal spacing after headings
            y += body_fontsize * 0.3  # Reduced from 0.5
            list_counter = {}  # Reset list counter after heading
            
        elif is_list_item(line):
            # Check if line already has a number
            if has_existing_number(line):
                # Preserve existing number from markdown
                page, doc, y = insert_formatted_line(page, doc, x, y, line, 
                                                    heading_level=0, 
                                                    indent_level=indent_level,
                                                    list_number=None,
                                                    preserve_number=True)
            else:
                # Add new number for bullet points (*, -)
                if indent_level not in list_counter:
                    list_counter[indent_level] = 1
                else:
                    list_counter[indent_level] += 1
                
                page, doc, y = insert_formatted_line(page, doc, x, y, line, 
                                                    heading_level=0, 
                                                    indent_level=indent_level,
                                                    list_number=list_counter[indent_level],
                                                    preserve_number=False)
        else:
            # Check if this is a subtopic prompt line (ends with colon, introduces a list)
            is_subtopic_prompt = line.strip().endswith(':') and len(line.strip()) > 10
            
            # Add spacing before subtopic prompts
            if is_subtopic_prompt and y > margin + 10:
                y += body_fontsize * 0.8  # Add extra space before subtopic
            
            # Regular body text
            page, doc, y = insert_formatted_line(page, doc, x, y, line, 
                                                heading_level=0, 
                                                indent_level=indent_level)
            
            # Add spacing after subtopic prompts  
            if is_subtopic_prompt:
                y += body_fontsize * 0.3  # Add small space after subtopic

    # Save PDF
    doc.save(output_file)
    doc.close()
    print(f"PDF generated successfully: {output_file}")

# Allow running as standalone script
if __name__ == "__main__":
    generate_pdf()
