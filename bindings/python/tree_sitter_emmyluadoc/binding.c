#include <Python.h>

typedef struct TSLanguage TSLanguage;

TSLanguage *tree_sitter_emmyluadoc(void);

static PyObject* language(PyObject *self, PyObject *args) {
    return PyLong_FromVoidPtr(tree_sitter_emmyluadoc());
}

static PyObject* language_version(PyObject *self, PyObject *args) {
    return PyLong_FromLong(TREE_SITTER_LANGUAGE_VERSION);
}

static PyMethodDef methods[] = {
    {"language", language, METH_NOARGS,
     "Get the tree-sitter language for EmmyLuaDoc."},
    {"language_version", language_version, METH_NOARGS,
     "Get the tree-sitter language version."},
    {NULL, NULL, 0, NULL}
};

static struct PyModuleDef module = {
    PyModuleDef_HEAD_INIT,
    "_binding",
    "Tree-sitter bindings for EmmyLuaDoc",
    -1,
    methods
};

PyMODINIT_FUNC PyInit__binding(void) {
    PyObject *m = PyModule_Create(&module);
    if (m == NULL) return NULL;

    PyModule_AddIntConstant(m, "LANGUAGE_VERSION", TREE_SITTER_LANGUAGE_VERSION);

    return m;
}
