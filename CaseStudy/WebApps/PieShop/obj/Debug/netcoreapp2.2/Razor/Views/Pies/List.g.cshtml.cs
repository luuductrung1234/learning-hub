#pragma checksum "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\WebApps\PieShop\Views\Pies\List.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "a65334bdd00e8ad8e4423ae90cc76eacd22382ff"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Pies_List), @"mvc.1.0.view", @"/Views/Pies/List.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/Pies/List.cshtml", typeof(AspNetCore.Views_Pies_List))]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#line 1 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\WebApps\PieShop\Views\_ViewImports.cshtml"
using PieShop.Models;

#line default
#line hidden
#line 2 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\WebApps\PieShop\Views\_ViewImports.cshtml"
using PieShop.ViewModels;

#line default
#line hidden
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"a65334bdd00e8ad8e4423ae90cc76eacd22382ff", @"/Views/Pies/List.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"3581187ad24e5d67ce698883159f27d71aae7f25", @"/Views/_ViewImports.cshtml")]
    public class Views_Pies_List : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<PiesListViewModel>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            BeginContext(26, 2, true);
            WriteLiteral("\r\n");
            EndContext();
#line 3 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\WebApps\PieShop\Views\Pies\List.cshtml"
 if (Model.CurrentCategory != null)
{

#line default
#line hidden
            BeginContext(68, 20, true);
            WriteLiteral("   <div>\r\n      <h2>");
            EndContext();
            BeginContext(89, 26, false);
#line 6 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\WebApps\PieShop\Views\Pies\List.cshtml"
     Write(Model.CurrentCategory.Name);

#line default
#line hidden
            EndContext();
            BeginContext(115, 18, true);
            WriteLiteral("</h2>\r\n   </div>\r\n");
            EndContext();
#line 8 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\WebApps\PieShop\Views\Pies\List.cshtml"
}

#line default
#line hidden
            BeginContext(136, 21, true);
            WriteLiteral("\r\n<div class=\"row\">\r\n");
            EndContext();
#line 11 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\WebApps\PieShop\Views\Pies\List.cshtml"
    foreach (var pie in Model.Pies)
   {

#line default
#line hidden
            BeginContext(200, 75, true);
            WriteLiteral("      <div class=\"card col-sm-6 col-md-6 col-lg-4 col-xl-4\">\r\n         <img");
            EndContext();
            BeginWriteAttribute("src", " src=\"", 275, "\"", 303, 1);
#line 14 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\WebApps\PieShop\Views\Pies\List.cshtml"
WriteAttributeValue("", 281, pie.ImageThumbnailUrl, 281, 22, false);

#line default
#line hidden
            EndWriteAttribute();
            BeginContext(304, 17, true);
            WriteLiteral(" class=\"card-img\"");
            EndContext();
            BeginWriteAttribute("alt", " alt=\"", 321, "\"", 336, 1);
#line 14 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\WebApps\PieShop\Views\Pies\List.cshtml"
WriteAttributeValue("", 327, pie.Name, 327, 9, false);

#line default
#line hidden
            EndWriteAttribute();
            BeginContext(337, 159, true);
            WriteLiteral(">\r\n         <div class=\"card-body\">\r\n            <div class=\"row\">\r\n               <div class=\"col-md-8\">\r\n                  <h3 class=\"text-left\"><a href=\"#\">");
            EndContext();
            BeginContext(497, 8, false);
#line 18 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\WebApps\PieShop\Views\Pies\List.cshtml"
                                               Write(pie.Name);

#line default
#line hidden
            EndContext();
            BeginContext(505, 114, true);
            WriteLiteral("</a></h3>\r\n               </div>\r\n               <div class=\"col-md-4\">\r\n                  <h3 class=\"text-right\">");
            EndContext();
            BeginContext(620, 9, false);
#line 21 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\WebApps\PieShop\Views\Pies\List.cshtml"
                                    Write(pie.Price);

#line default
#line hidden
            EndContext();
            BeginContext(629, 83, true);
            WriteLiteral("</h3>\r\n               </div>\r\n            </div>\r\n            <p class=\"card-text\">");
            EndContext();
            BeginContext(713, 20, false);
#line 24 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\WebApps\PieShop\Views\Pies\List.cshtml"
                            Write(pie.ShortDescription);

#line default
#line hidden
            EndContext();
            BeginContext(733, 103, true);
            WriteLiteral("</p>\r\n            <a href=\"#\" class=\"btn btn-primary\">View Details</a>\r\n         </div>\r\n      </div>\r\n");
            EndContext();
#line 28 "f:\SourceCode\Research_BackEnd\LDTSolutions\CaseStudy\WebApps\PieShop\Views\Pies\List.cshtml"
   }

#line default
#line hidden
            BeginContext(842, 8, true);
            WriteLiteral("</div>\r\n");
            EndContext();
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<PiesListViewModel> Html { get; private set; }
    }
}
#pragma warning restore 1591
