# from sphinx_markdown_parser.parser import MarkdownParser

author = 'Jam Risser'
copyright = '2020, '+author
description = ''
html_static_path = ['_static']
html_theme = 'sphinx_rtd_theme'
project = 'pipedoc-example'
htmlhelp_basename = project+'doc'
js_language = 'typescript'
js_source_paths = ['../../../../src']
language = None
master_doc = 'index'
needs_sphinx = '1.0'
primary_domain = 'js'
pygments_style = 'sphinx'
release = '0.0.6'
templates_path = ['_templates']
todo_include_todos = False
extensions = [
    'recommonmark',
    'sphinx.ext.mathjax',
    'sphinx_js'
]
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
    'dist/**/*',
    'env/**/*'
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
    # app.add_source_parser(MarkdownParser)
    # app.add_source_suffix('.md', 'markdown')
    app.add_config_value('markdown_parser_config', {
        'auto_toc_tree_section': 'Content',
        'enable_auto_doc_ref': True,
        'enable_auto_toc_tree': True,
        'enable_eval_rst': True,
        'extensions': [
            'extra',
            'nl2br',
            'pymdownx.arithmatex',
            'sane_lists',
            'smarty',
            'toc',
            'wikilinks'
        ],
    }, True)
