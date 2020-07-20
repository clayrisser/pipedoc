from sphinx_markdown_parser.parser import MarkdownParser

author = 'Jam Risser'
description = ''
extensions = []
html_static_path = ['_static']
html_theme = 'sphinx_rtd_theme'
js_source_path = '../src'
language = None
master_doc = 'index'
needs_sphinx = '1.0'
primary_domain = 'js'
project = 'pipedoc-example'
pygments_style = 'sphinx'
release = '0.0.6'
source_suffix = ['.rst', '.md']
templates_path = ['_templates']
todo_include_todos = False
copyright = '2020, '+author
htmlhelp_basename = project+'doc'
latex_documents = [(
  master_doc,
  project+'.tex',
  project+' documentation',
  author,
  'manual'
)]
latex_elements = {
  'papersize': 'letterpaper',
  'pointsize': '10pt',
  'preamble': '',
  'figure_align': 'htbp'
}
man_pages = [(
  master_doc,
  project,
  project+' documentation',
  [author],
  1
)]
exclude_patterns = [
  'dist/*',
  'sphinx.ext.mathjax',
  'sphinx_js'
]
texinfo_documents = [(
    master_doc,
    project,
    project+' documentation',
    author,
    project,
    description,
    'Miscellaneous'
)]

def setup(app):
    app.add_source_suffix('.md', 'markdown')
    app.add_source_parser(MarkdownParser)
    app.add_config_value('markdown_parser_config', {
        'auto_toc_tree_section': 'Content',
        'enable_auto_doc_ref': True,
        'enable_auto_toc_tree': True,
        'enable_eval_rst': True,
        'extensions': [
            'extra',
            'nl2br',
            'sane_lists',
            'smarty',
            'toc',
            'wikilinks',
            'pymdownx.arithmatex',
        ],
    }, True)
