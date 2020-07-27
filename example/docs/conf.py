# from sphinx_markdown_parser.parser import MarkdownParser
from recommonmark.transform import AutoStructify

author = 'Jam Risser'
copyright = '2020, '+author
description = ''
doc_root = 'https://github.com/rtfd/recommonmark/tree/master/doc/'
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
    # app.add_config_value('markdown_parser_config', {
    app.add_config_value('recommonmark_config', {
        'auto_toc_tree_section': 'Content',
        'auto_toc_tree_section': 'Contents',
        'enable_auto_doc_ref': True,
        'enable_auto_toc_tree': True,
        'enable_eval_rst': True,
        'url_resolver': lambda url: doc_root + url,
        # 'extensions': [
        #     'extra',
        #     'nl2br',
        #     'pymdownx.arithmatex',
        #     'sane_lists',
        #     'smarty',
        #     'toc',
        #     'wikilinks'
        # ],
    }, True)
    app.add_transform(AutoStructify)
