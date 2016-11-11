using System.Web;
using System.Web.Optimization;

namespace APVTranslator_Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));
            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/bootstrap-social.css"));
            //common
            bundles.Add(new ScriptBundle("~/bundles/commonjs").Include("~/Scripts/common/*.js"));
            //loading-bar
            bundles.Add(new ScriptBundle("~/bundles/loading_js").Include("~/Scripts/angular-loading-bar/*.js"));
            bundles.Add(new StyleBundle("~/bundles/loading_css").Include("~/Content/angular-loading-bar/*.css"));
            //material
            bundles.Add(new ScriptBundle("~/bundles/material_js").Include("~/Scripts/material.min.js"));
            bundles.Add(new StyleBundle("~/bundles/material_css").Include("~/Content/material.min.css"));
            //angularjs material
            bundles.Add(new ScriptBundle("~/bundles/angular_js").Include("~/Scripts/angular/*.js"));
            bundles.Add(new ScriptBundle("~/bundles/angular-animate_js").Include("~/Scripts/angular-animate/*.js"));
            bundles.Add(new ScriptBundle("~/bundles/angular-aria_js").Include("~/Scripts/angular-aria/*.js"));
            bundles.Add(new ScriptBundle("~/bundles/angular-material_js").Include("~/Scripts/angular-material/*.js"));
            bundles.Add(new ScriptBundle("~/bundles/angular-grid_js").Include("~/Scripts/angular-grid/*.js"));
            bundles.Add(new StyleBundle("~/bundles/angular-custom_css").Include("~/Content/angular-custom.css"));
            //
            bundles.Add(new StyleBundle("~/bundles/angular_material_css").Include("~/Content/angular-material/*.css"));
            //layout
            bundles.Add(new ScriptBundle("~/bundles/script/_Layout").Include("~/Scripts/layouts/_Layout.js"));
            bundles.Add(new StyleBundle("~/bundles/content/_Layout").Include("~/Content/layouts/_Layout.css"));
            bundles.Add(new ScriptBundle("~/bundles/script/_TranslateLayout").Include("~/Scripts/layouts/_TranslateLayout.js"));
            bundles.Add(new StyleBundle("~/bundles/content/_TranslateLayout").Include("~/Content/layouts/_TranslateLayout.css"));
            //view
            bundles.Add(new ScriptBundle("~/bundles/script/home").Include("~/Scripts/views/home/*.js"));
            bundles.Add(new StyleBundle("~/bundles/content/home").Include("~/Content/views/home/*.css"));
            bundles.Add(new ScriptBundle("~/bundles/script/translate").Include("~/Scripts/views/translate/*.js"));
            bundles.Add(new StyleBundle("~/bundles/content/translate").Include("~/Content/views/translate/*.css"));

            //
            bundles.Add(new ScriptBundle("~/bundles/angular-tag-input_js").Include("~/Scripts/angular-tag-input/ng-tags-input.min.js"));
            bundles.Add(new StyleBundle("~/bundles/angular-tag-input_css").Include(
                "~/Content/angular-tag-input/ng-tags-input.min.css",
                 "~/Content/angular-tag-input/ng-tags-input.bootstrap.min.css"
                ));
            bundles.Add(new ScriptBundle("~/bundles/angular-bootstrap-datetimepicker_js").Include(
                "~/Scripts/angular-bootstrap-datetimepicker/moment.js",
                 "~/Scripts/angular-bootstrap-datetimepicker/datetimepicker.js",
                  "~/Scripts/angular-bootstrap-datetimepicker/datetimepicker.templates.js",
                  "~/Scripts/angular-bootstrap-datetimepicker/dateTimeInput.js"
                ));
            bundles.Add(new StyleBundle("~/bundles/angular-bootstrap-datetimepicker_css").Include(
               "~/Content/angular-bootstrap-datetimepicker/datetimepicker.css"
               ));
        }
    }
}
