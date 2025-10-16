from setuptools import setup, Extension
from setuptools.command.build import build
from wheel.bdist_wheel import bdist_wheel
import os
import platform


class Build(build):
    def run(self):
        if platform.system() == "Windows":
            os.system("tree-sitter generate")
        else:
            os.system("tree-sitter generate")
        super().run()


class BdistWheel(bdist_wheel):
    def get_tag(self):
        python, abi, plat = super().get_tag()
        if python.startswith("cp"):
            python, abi = "cp38", "abi3"
        return python, abi, plat


setup(
    name="tree-sitter-emmyluadoc",
    version="0.1.0",
    description="EmmyLua documentation grammar for tree-sitter",
    long_description=open("README.md", encoding="utf8").read(),
    long_description_content_type="text/markdown",
    author="",
    author_email="",
    url="https://github.com/yourusername/tree-sitter-emmyluadoc",
    license="MIT",
    platforms=["any"],
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Topic :: Software Development :: Compilers",
        "Topic :: Text Processing :: Linguistic",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    keywords=["tree-sitter", "emmylua", "lua", "parser"],
    packages=["tree_sitter_emmyluadoc"],
    package_dir={"": "bindings/python"},
    package_data={
        "tree_sitter_emmyluadoc": ["*.pyi", "py.typed"],
    },
    ext_modules=[
        Extension(
            name="tree_sitter_emmyluadoc._binding",
            sources=[
                "bindings/python/tree_sitter_emmyluadoc/binding.c",
                "src/parser.c",
                # NOTE: if your language uses an external scanner, add it here.
            ],
            include_dirs=["src"],
            extra_compile_args=[
                "-std=c99",
            ] if platform.system() != "Windows" else [
                "/std:c99",
                "/utf-8",
            ],
            define_macros=[
                ("Py_LIMITED_API", "0x03080000"),
                ("PY_SSIZE_T_CLEAN", None)
            ],
            py_limited_api=True,
        )
    ],
    cmdclass={
        "build": Build,
        "bdist_wheel": BdistWheel,
    },
    python_requires=">=3.8",
    install_requires=[],
    zip_safe=False
)
